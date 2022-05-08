var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AddressListSchema = new Schema({

    CountryName:{type:String,require:true},
    Address:{type:String},
    City:{type:String},
    State:{type:String,require:true},
    BankName:{type:String},
    Location:{type:String},
    MobileNo:{type:String},
    Landmark:{type:String},
    Zip:{type:Number},
    CreatedBy:Schema.Types.ObjectId,
    isDeleted:{type:Boolean, default:false},
})
module.exports = mongoose.model('AddressList', AddressListSchema);