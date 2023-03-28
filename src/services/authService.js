const User = require("../models/User");
const {findUserByProperty} = require("./userService");

exports.registerService = async(
    { email, mobile, firstName, lastName, password, confirmPassword}
)=>{
    const isMatch = await findUserByProperty('email', email);
    if (isMatch){
        return res.status(400).json({
            status: 'fail',
            error: 'Email already taken'
        })
    }


    const OtpCode = Math.floor(100000 + Math.random() * 900000);

    const isExitEmail = await OtpModel.findOne({email})

    if (isExitEmail){
        await OtpModel.updateOne({email}, {$set: {otp: OtpCode, status: 0}});
    }else {
        await OtpModel.create({email, otp: OtpCode})
    }
    // Email Send
    const SendEmail = await sendEmail(email,"Your Verification Code is= "+ OtpCode,"Blog site email verification")

    if (SendEmail[0].statusCode === 202){
        const user = await registerService(req.body);
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: 'success',
            message: 'OTP send successfully, please check your email',
        })
    }else {
        res.status(500).json({
            status: 'fail',
            error: 'Server error occurred'
        })
    }

};
