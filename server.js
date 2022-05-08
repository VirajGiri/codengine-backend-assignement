/**
 * Created by viraj on 20/6/2019.
 */
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config/config');
var mongoose = require('mongoose');
var json2xls = require('json2xls');

var app = express();
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true }, function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log('connected to the databse');
    }
});

app.use(json2xls.middleware);
//set limit for request body-- This is added to send long data in request ex. base64 string for photo
app.use(bodyParser.json({limit: '10mb'}));




app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,x-access-token');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use(morgan('dev'));


app.use(bodyParser.json());// support json encoded bodies

// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

//set limit for request body
app.use(bodyParser.json({limit: '50mb'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));

var api = require('./app/routes/master')(app, express);
app.use('/api',api);

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

module.exports = app;


