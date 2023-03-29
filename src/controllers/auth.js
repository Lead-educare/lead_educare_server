const authService = require("../services/authService");
const mongoose = require("mongoose");
const FormHelper = require('../helpers/FormHelper');

exports.register = async (req, res, next) => {
    try {
        const {email, mobile, firstName, lastName, password, confirmPassword} = req.body;


        if (FormHelper.isEmpty(email)){
            return res.status(400).json({
                error: 'Email is required'
            })
        }
        if (!FormHelper.isEmail(email)){
            return res.status(400).json({
                error: 'Provide a valid email address'
            })
        }
        if (FormHelper.isEmpty(firstName)){
            return res.status(400).json({
                error: 'First Name is required'
            })
        }
        if (FormHelper.isEmpty(lastName)){
            return res.status(400).json({
                error: 'Last Name is required'
            })
        }
        if (FormHelper.isEmpty(mobile)){
            return res.status(400).json({
                error: 'Mobile number is required'
            })
        }
        if (!FormHelper.isMobile(mobile)){
            return res.status(400).json({
                error: 'Provide a valid mobile number'
            })
        }

        if (FormHelper.isEmpty(password)){
            return res.status(400).json({
                error: 'Password is required'
            })
        }
        if (!FormHelper.isPasswordValid(password)){
            return res.status(400).json({
                error: 'Password must contain at least 8 characters long, one uppercase letter, one lowercase letter, one digit and one special character'
            })
        }
        if (FormHelper.isEmpty(confirmPassword)){
            return res.status(400).json({
                error: 'Confirm password is required'
            })
        }
        if (!FormHelper.comparePassword(password, confirmPassword)){
            return res.status(400).json({
                error: "Password doesn't match"
            })
        }


        await authService.registerService({email, mobile, firstName, lastName, password, confirmPassword});


        res.status(201).json({
            message: 'OTP Send success in your email'
        });

    } catch (e) {
        next(e)
    }
};

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const token = await authService.loginService({email, password});
        res.status(200).json({
            token
        })
    } catch (e) {
        next(e)
    }
};

exports.sendOtp = async (req, res, next) => {
    try {
        const email = req.params?.email;
        const otp = await authService.sendOtpService(email);
        res.status(200).json({
            message: 'OTP send successfully, please check your email',
            otp
        })
    } catch (e) {
        next(e)
    }
}


exports.verifyOTP = async (req, res, next) => {
    let email = req.params.email;
    let otp = req.params.otp;

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
        // Without transaction
       /* let OTPCount = await OtpModel.aggregate([
            {$match: {email: email, otp: OTPCode, status: status}}, {$count: "total"}
        ])

        if (OTPCount.length > 0) {

            let OTPUpdate = await OtpModel.updateOne({email, otp: OTPCode, status: status}, {
                email: email,
                otp: OTPCode,
                status: statusUpdate
            })


            await UserModel.updateOne({email}, {verified: true});

        } else {
            res.status(400).json({
                status: "fail",
                error: "Invalid OTP Code"
            })
        }
        res.status(200).json({
            message: "OTP verify successfully",
        })*/

        // With Transaction
        const options = { session };
        await authService.verifyOtpService(email, otp, options);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: "OTP verify successfully",
        })

    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error('Transaction aborted:', e);
        next(e)
    }
}


exports.passwordChange = async (req, res, next) => {
    try {
        const {oldPassword, password, confirmPassword} = req.body;
        const email = req.auth?.email;

        if (FormHelper.isEmpty(oldPassword)) {
            return res.status(400).json({
                error: "Old password is required"
            });
        }
        if (FormHelper.isEmpty(password)) {
            return res.status(400).json({
                error: "Password is required"
            });
        }
        if (FormHelper.isEmpty(confirmPassword)) {
            return res.status(400).json({
                error: "Confirm password is required"
            });
        }
        if (!FormHelper.isPasswordValid(password)){
            return res.status(400).json({
                error: "Password must contain at least 8 characters long, one uppercase letter, one lowercase letter, one digit and one special character"
            });
        }
        if (!FormHelper.comparePassword(password, confirmPassword)) {
            return res.status(400).json({
                error: "Password doesn't match"
            });
        }
        const isUpdate = await authService.passwordChangeService({email, oldPassword, password});

        if (isUpdate.modifiedCount === 0){
            return res.status(200).json({
                message: 'password not change',
            });
        }

        res.status(200).json({
            message: 'password change successfully',
        });


    } catch (e) {
        next(e)
    }
}

exports.resetPassword = async (req, res, next) => {

    let {email, otp} = req.params;
    let {password, confirmPassword} = req.body;
    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
        const options = { session };

        if (FormHelper.isEmpty(password)) {
            return res.status(400).json({
                error: "Password is required"
            });
        }
        if (!FormHelper.isPasswordValid(password)){
            return res.status(400).json({
                error: "Password must contain at least 8 characters long, one uppercase letter, one lowercase letter, one digit and one special character"
            });
        }
        if (FormHelper.isEmpty(confirmPassword)) {
            return res.status(400).json({
                error: "Confirm password is required"
            });
        }

        if (!FormHelper.comparePassword(password, confirmPassword)) {
            return res.status(400).json({
                error: "Password doesn't match"
            });
        }


        const isUpdate = await authService.resetPasswordService({email, otp, password, confirmPassword, options});

        await session.commitTransaction();
        session.endSession();

        if (isUpdate.modifiedCount === 0){
            return res.status(200).json({
                message: 'Password not reset'
            })
        }

        res.status(200).json({
            message: 'Password reset successfully'
        })
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.log(e)
        next(e)
exports.resetPassword = async (req, res) => {

    let email = req.params.email;
    let OTPCode = req.params.otp;
    let {password, confirmPassword} = req.body;
    let statusUpdate = 1;

    try {
        const otp = await OtpModel.aggregate([
            {$match: {email: email, otp: OTPCode, status: statusUpdate}}
        ])

        if (otp[0]?.status !== 1) {
            return res.status(400).json({
                status: 'fail',
                error: 'Invalid request'
            })
        }

        const user = await getUserByEmailService(email);

        if (!user) {
            return res.status(400).json({
                status: 'fail',
                error: 'Invalid request'
            });
        }

        if (password === '') {
            return res.status(400).json({
                status: 'fail',
                error: "password is required"
            });
        }
        if (confirmPassword === '') {
            return res.status(400).json({
                status: 'fail',
                error: "confirmPassword is required"
            });
        }

        const validate = validator.isStrongPassword(password, {
            minLength: 8,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minLowercase: 1
        })

        if (!validate) {
            return res.status(400).json({
                status: 'fail',
                error: "Password is not strong, please provide a strong password"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'fail',
                error: "Password doesn't match"
            });
        }

        const hash = hashPassword(password);

        const result = await passwordUpdateService(email, hash);

        await OtpModel.updateOne({email: email, otp: OTPCode, status: 1}, {
            otp: '',
        })

        res.status(200).json({
            result
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'fail',
            error: 'Server error occurred'
        });
    }
}

// Role and permission controller

exports.createRole = async ()=>{

}
exports.createPermission = async (req, res, next)=>{
    const {permission, roleId} = req.body;
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
        const options = { session };
        const result = await authService.createNewPermissionService({permissionName: permission, roleId, options});
        await session.commitTransaction();
        session.endSession();
        res.status(200).json(result);
    }catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error('Transaction aborted:', e);
        next(e)
    }
}