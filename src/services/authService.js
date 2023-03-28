const userService = require("./userService");
const error = require('../helpers/error');
const otpService = require("./otpService");
const sendOTP = require('../helpers/sendOTP');

exports.registerService = async(
    { email, mobile, firstName, lastName, password, confirmPassword}
)=>{
    const isMatch = await userService.findUserByProperty('email', email);
    if (isMatch) throw error('Email already taken', 400);

    const isOtp= await otpService.findOptByEmail(email);
    let otp;
    if (isOtp){
       otp = await otpService.updateOtp(email)
    }else {
       otp = await otpService.createOtp(email);
    }
    // Email Send
    const send = await sendOTP(email,"Your Verification Code is= "+ otp?.otp, `${process.env.APP_NAME} email verification`)

    if (send[0].statusCode === 202){
       return await userService.createNewUser({email, mobile, firstName, lastName, password, confirmPassword});
    }else {
        throw error('Server error occurred', 5000)
    }

};
