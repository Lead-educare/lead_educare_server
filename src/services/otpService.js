const OtpModel = require("../models/Otp");

const otp = Math.floor(100000 + Math.random() * 900000);

const findOptProperty = (propertyObj)=>{
   return OtpModel.findOne(propertyObj)
}

const updateOtp = (email)=>{
    return OtpModel.updateOne({email}, {$set: {otp, status: 0}}, {new: true});
}

const createOtp = (email)=>{
    return OtpModel.create({email, otp})
}

module.exports = {
    findOptProperty, updateOtp, createOtp
}