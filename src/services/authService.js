const userService = require("./userService");
const error = require('../helpers/error');
const otpService = require("./otpService");
const sendOTP = require('../helpers/sendOTP');
const FormHelper = require('../helpers/FormHelper');
const authHelper = require('../helpers/authHelper');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

const createNewRoleService = async ({roleName})=>{
    const role = new Role({name: roleName});
    return await role.save();
}
const createNewPermissionService = async ({permissionName, roleId, options})=>{

    const role = await Role.findById(roleId);
    if (!role)throw error('Role not found', 400);

    const permission = new Permission({name: permissionName});
    await permission.save(options);

    const updateRole = await Role.findByIdAndUpdate(roleId, {$addToSet: {permissions: permission._id}}, {options});

    return {permission, role: updateRole}
}
const registerService = async (
    {email, mobile, firstName, lastName, password, confirmPassword, role = 'USER'}
) => {
    const isMatch = await userService.findUserByProperty('email', email);
    if (isMatch) throw error('Email already taken', 400);

    const isOtp = await otpService.findOptByProperty({email: email});
    const otp = Math.floor(100000 + Math.random() * 900000);

    if (isOtp) {
        await otpService.updateOtp({email, otp, status: 0})
    } else {
        await otpService.createOtp({email, otp});
    }
    // Email Send
    const send = await sendOTP(email, "Your Verification Code is= " + otp, `${process.env.APP_NAME} email verification`)

    const isOtp = await otpService.findOptByEmail(email);
    let otp;
    if (isOtp) {
        otp = await otpService.updateOtp(email)
    } else {
        otp = await otpService.createOtp(email);
    }
    // Email Send
    const send = await sendOTP(email, "Your Verification Code is= " + otp?.otp, `${process.env.APP_NAME} email verification`)


    if (send[0].statusCode === 202) {
        const newRole = await createNewRoleService({roleName: role});
        return await userService.createNewUser({email, mobile, firstName, lastName, password, confirmPassword, roles: newRole?._id});
    } else {
        throw error('Server error occurred', 5000)
    }

};

const loginService = async (
    {email, password}
) => {

    const user = await userService.findUserByProperty('email', email);
    if (!user) throw error('Email or password do not match', 400);

    const isMatch = authHelper.comparePassword({password, hash: user.password});
    if (!isMatch) throw error('Email or password do not match', 400);

    if (!user?.verified) throw error('Your account is not verify. please verify your account', 400);
    if (user?.status !== 'active') throw error('Your account is not active. please contact Administrator', 400);

    const payload = {
        email: user.email,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        mobile: user.mobile,
        status: user.status,
        verified: user.verified
    }
    return authHelper.createToken(payload);

}

const sendOtpService = async (email) => {

    const isUser = await userService.findUserByProperty('email', email);

    if (!isUser) throw error('Account not found', 400);
    const isOtp = await otpService.findOptByProperty({email});
    const otp = Math.floor(100000 + Math.random() * 900000);

    if (isOtp) {
        await otpService.updateOtp({email, otp, status: 0})
    } else {
         await otpService.createOtp({email, otp});
    }
    // Email Send
    const send = await sendOTP(email, "Your Verification Code is= " + otp, `${process.env.APP_NAME} email verification`);

    if (send[0].statusCode !== 202) {
        throw error('Server error occurred', 5000)
    }
    return otp?.otp;
}

const verifyOtpService = async (email, otp, options) => {

    const isOtp = await otpService.findOptByProperty({email, otp, status: 0}, null, options)


    const isOtp = otpService.findOptProperty({email, otp, status: 0}, null, options)

    if (!isOtp) throw error('Invalid OTP', 400);

    isOtp.status = 1;

    let status = 0;
    let statusUpdate = 1;

    const isOtp = otpService.findOptProperty({email, otp, status: status}, null, options)
    if (!isOtp) throw error('Invalid OTP', 400);

    isOtp.status = statusUpdate;

    await isOtp.save(options);

    const user = await userService.findUserByProperty('email', email, {verified: 1, _id: 1});
    user.verified = true;
    return user.save(options);

}

const passwordChangeService = async ({email, oldPassword, password}) => {

const passwordChangeService = async ({email, oldPassword, password, confirmPassword})=>{


    const user = await userService.findUserByProperty('email', email);

    const userHashPassword = user ? user.password : '';

    const isMatch = authHelper.comparePassword({password: oldPassword, hash: userHashPassword});

    if (!isMatch) throw error("Old password doesn't match", 400);

    const hash = authHelper.hashPassword(password);


    return userService.passwordUpdateService({email, hash});
}


const resetPasswordService = async ({email, otp, password, options}) => {

    const isOtp = await otpService.findOptByProperty({email, otp, status: 1})

    if (!isOtp) throw error('Invalid request', 400);

    // const user = await getUserByEmailService(email);
    const isUser = await userService.findUserByProperty('email', email);

    if (!isUser) throw error('Invalid request', 400);

    const hash = authHelper.hashPassword(password);

    await userService.passwordUpdateService({email, hash, options});

    return otpService.updateOtp({email, otp, status: 1, options});

    return userService.passwordUpdateService(email, hash);

}


module.exports = {
    registerService, loginService, sendOtpService, verifyOtpService, passwordChangeService, resetPasswordService, createNewRoleService, createNewPermissionService

    registerService, loginService, sendOtpService, verifyOtpService, passwordChangeService, resetPasswordService
    registerService, loginService, resendOtpService, verifyOtpService, passwordChangeService, resetPasswordService
    registerService, loginService, resendOtpService, verifyOtpService, passwordChangeService
}



