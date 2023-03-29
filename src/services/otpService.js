const OtpModel = require("../models/Otp");

const otp = Math.floor(100000 + Math.random() * 900000);


const findOptByProperty = (propertyObj)=>{
   return OtpModel.findOne(propertyObj)
}


const updateOtp = ({email, otp, status, options = null})=>{
    if (options !== null){
        return OtpModel.updateOne({email: email, otp: otp, status: status},  {otp: ''}, {options});
    }
    return OtpModel.updateOne({email}, {$set: {otp, status: status}}, {new: true});
}

const createOtp = (email)=>{

    return OtpModel.create({email, otp})
}

module.exports = {
    findOptByProperty, updateOtp, createOtp
}