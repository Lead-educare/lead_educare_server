const OtpModel = require("../models/Otp");



const findOptByProperty = (propertyObj)=>{
   return OtpModel.findOne(propertyObj)
}

const updateOtp = ({email, otp, status, options = null})=>{
    if (options !== null){
        return OtpModel.updateOne({email: email, otp: otp, status: status},  {otp: ''}, {options});
    }
    return OtpModel.updateOne({email}, {$set: {otp, status: status}}, {new: true});
}

const createOtp = ({email, otp})=>{
    return OtpModel.create({email, otp})
}

module.exports = {
    findOptByProperty, updateOtp, createOtp
}