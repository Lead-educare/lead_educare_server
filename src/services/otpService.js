const OtpModel = require("../models/Otp");

const otp = Math.floor(100000 + Math.random() * 900000);

exports.findOptByEmail = (email)=>{
   return OtpModel.findOne({email})
}

exports.updateOtp = (email)=>{
    return OtpModel.updateOne({email}, {$set: {otp, status: 0}}, {new: true});
}

exports.createOtp = (email)=>{
    return OtpModel.create({email, otp})
}