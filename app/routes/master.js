var User = require('../models/users');
var Address = require('../models/address-list');
var config = require('../../config/config');
var jsonwebtoken = require('jsonwebtoken');
var secretKey = config.secretKey;

function createToken(user) {
    var token = jsonwebtoken.sign({
        _id: user._id,
        username: user.username
    }, secretKey, {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
    });
    return token;
}

module.exports = function (app, express) {

    var api = express.Router();

    api.post('/add_user', function (req, res) {

        var username = req.body.username || req.body.Email;
        var user = new User({
            Name: req.body.Name,
            Email: req.body.Email,
            username: username,
            password: req.body.Password
        });
        // var token = createToken(user);
        user.save(function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: "user has been created"
            });
        });

    });
    api.post('/login', function (req, res) {
        console.log("login api called",req.body.username);
        User.findOne({
            username: req.body.username
        }).select('Name username password isActive').exec(function (err, user) {
            if (err) {
                res.send(err);
                return;
            }
            if (!user) {
                res.send({message: "user dosent exist"});
            } else if (user) {

                if (user.isActive == true) {

                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.send({message: "Invalid password"});
                    } else {
                        var token = createToken(user);
                        res.json({
                            data: user,
                            success: true,
                            message: "successfuly login",
                            token: token
                        });
                    }
                }
            }
        });
    });
    api.get('/get_all_users', function (req, res) {
        User.find({isActive:true}).exec(function (err, data) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(data);
        });
    });
 
    api.use(function (req, res, next) {

        console.log("user just come to our app");

        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // console.log("user token",token);
        if (token) {
            jsonwebtoken.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    res.status(403).send({success: false, message: "fail to authonticate user"});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({success: false, message: "No Token provided"});

        }
    });

    api.post('/add_address', function (req, res) {
    try {
        var addr = new Address({
            CountryName: req.body.CountryName,
            Location: req.body.Location,
            BankName: req.body.BankName,
            Address: req.body.Address,
            City:req.body.City,
            State:req.body.State,
            MobileNo: req.body.MobileNo,
            Landmark: req.body.Landmark,
            Zip: req.body.Zip,
            created_by: req.body.created_by,
        });
        addr.save(function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: "address has been added"
            });
           
        });
    } catch (err) {
        console.error("address error",err);
    }
    });
    api.get('/get_address_list', function (req, res) {
        Address.find({isDeleted:false}).exec(function (err, data) {
            if (err) {
                res.send(err);
                return;
            }
            res.json(data);
        });
    });

    api.post('/delete_address_by_id', (req, res) => {
        console.log("req.body",req.body)
        Address.updateOne({ _id: req.body._id }, {$set: {isDeleted:true}}, function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: "address has been deleted"
            });
        });
        
    })
    api.post('/update_address_by_id', (req, res) => {
        console.log("req.body",req.body)
        Address.updateOne({ _id: req.body._id }, {$set: { 
            CountryName: req.body.CountryName,
            Location: req.body.Location,
            BankName: req.body.BankName,
            City:req.body.City,
            State:req.body.State,
            Zip: req.body.Zip}}, function (err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({
                success: true,
                message: "Address has been updated"
            });
        });
        
      })
    

  



    return api;
}