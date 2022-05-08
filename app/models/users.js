/**
 * Created by viraj on 3/13/2019.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    Name:{type:String, require:false},
    Email:{type:String, require:false},
    username:{type:String, require:true, index:{unique:true}},
    password:{type:String, require:true, select:false},
    isActive:{type:Boolean, default:true},
    isDeleted:{type:Boolean, default:false},
});

UserSchema.pre('save', function(next){
    var user = this;
    console.log("user",user);

    if(!user.isModified('password')){
        return next();
    }

    bcrypt.hash(user.password, null, null, function(err, hash){
        if(err) {
            throw err;
            return next("I am in err",err);
            
        }

        user.password = hash;
        next();
    });

});
UserSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}
UserSchema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user.password);
}

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);
