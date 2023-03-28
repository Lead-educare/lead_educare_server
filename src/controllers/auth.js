const {registerService} = require("../services/authService");

exports.register = async (req, res)=>{
    try{
        const {email, mobile, firstName, lastName, password, confirmPassword} = req.body;

        const result = await registerService({email, mobile, firstName, lastName, password, confirmPassword});


    }catch(error){
        console.log(error)
        res.status(500).json({
            status: 'fail',
            error: 'Server error occurred'
        })
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password}  = req.body;

        const user = await getUserByEmailService(email);

        if (!user){
            return res.status(400).json({
                status: 'fail',
                error: 'Email or password do not match'
            })
        }

        const isPasswordValid = comparePassword(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({
                status: 'fail',
                error: 'Email or password do not match'
            })
        }

        if (!user.verified){
            return res.status(400).json({
                status: 'fail',
                error: 'Your account is not verify. please verify your account'
            })
        }

        if(user.status !== 'active'){
            return res.status(400).json({
                status: 'fail',
                error: 'Your account is not active. please contact Administrator'
            })
        }

        user.password = undefined;
        const payload = {
            email: user.email,
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
        }
        const token = createToken(payload);

        res.cookie('token', token, {
            httpOnly: true,
            // secure: true // only works https
        })

        res.status(200).json({
            status: 'success',
            message: "successfully logged in",
            user,
            token
        })
    }catch (error) {
        console.log(error);
        res.status(500).json({
            status: "fail",
            error: 'server error occurred',
        });
    }
};

exports.sendOTP = async (req, res) => {

    try {
        const email = req.params.email;

        const user = await userFindByEmailService(email);

        if (!user[0]){
            return res.status(400).json({
                status: "fail",
                error: 'User not found'
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
        if (SendEmail[0].statusCode !== 202){
            return res.status(500).json({
                status: "fail",
                error: 'Server error occurred'
            })
        }

        res.status(200).json({
            status: "success",
            message: 'OTP send successfully, please check your email',
            otp: OtpCode
        })

    }catch (e) {

        res.status(500).json({
            status: "fail",
            error: 'Server error occurred'
        })
    }
}


exports.verifyOTP=async (req,res)=>{
    let email = req.params.email;
    let OTPCode = req.params.otp;

    let status=0;
    let statusUpdate=1;

    // Create a new session
    /*	const session = await mongoose.startSession();
        await session.startTransaction();*/

    try {

        // Without transaction

        let OTPCount = await OtpModel.aggregate([
            {$match: {email: email, otp: OTPCode, status: status}}, {$count: "total"}
        ])

        if (OTPCount.length > 0) {

            let OTPUpdate = await OtpModel.updateOne({email, otp: OTPCode, status: status}, {
                email: email,
                otp: OTPCode,
                status: statusUpdate
            })


            await UserModel.updateOne({email}, {verified: true} );

        } else {
            res.status(400).json({
                status: "fail",
                error: "Invalid OTP Code"
            })
        }
        res.status(200).json({
            message: "OTP verify successfully",
        })

        // With Transaction
        /*const options = { session };
        const otp = await OtpModel.findOne({email, otp: OTPCode, status: status }, null, options);
        if (!otp){
            return res.status(400).json({
                error: "Invalid OTP",
            })
        }
        otp.status = statusUpdate;
        await otp.save(options);
        const user = await UserModel.findOne({email}, {verified: 1, _id: 1}, options);
        user.verified = true;
        await user.save(options);
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({
            message: "OTP verify successfully",
        })*/

    }
    catch (err) {
        /*	await session.abortTransaction();
            session.endSession();
            console.error('Transaction aborted:', err);*/

        res.status(500).json({
            status: "fail",
            error: 'Server error occurred'
        })
    }
}


exports.passwordUpdate = async (req, res)=>{
    try {
        const {oldPassword, password, confirmPassword} = req.body;

        if(oldPassword === ''){
            return res.status(400).json({
                status: 'fail',
                error: "Old password is required"
            });
        }

        const user = await getUserByEmailService(req.auth?.email);

        const userHashPassword =  user ? user.password : '';

        const isMatch = comparePassword(oldPassword, userHashPassword);

        if (!isMatch){
            return res.status(400).json({
                status: 'fail',
                error: "Old password doesn't match"
            });
        }

        const isValidate = validator.isStrongPassword(password, {
            minLength: 8,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minLowercase: 1
        })

        if (!isValidate){
            return res.status(400).json({
                status: 'fail',
                error: "Password must contain at least 8 characters long, one uppercase letter, one lowercase letter, one digit and one special character"
            });
        }

        if (password !== confirmPassword){
            return res.status(400).json({
                status: 'fail',
                error: "Password doesn't match"
            });
        }

        const hash = hashPassword(password);

        const result = await passwordUpdateService(req.auth?.email, hash);

        res.status(200).json({
            result
        });

    }catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'fail',
            error: 'Server error occurred'
        });
    }
}

exports.resetPassword= async (req,res)=>{

    let email = req.params.email;
    let OTPCode = req.params.otp;
    let {password, confirmPassword} =  req.body;
    let statusUpdate = 1;

    try {
        const otp = await OtpModel.aggregate([
            {$match: {email: email, otp: OTPCode, status: statusUpdate}}
        ])

        if (otp[0]?.status !== 1){
            return res.status(400).json({
                status: 'fail',
                error: 'Invalid request'
            })
        }

        const user = await getUserByEmailService(email);

        if(!user){
            return res.status(400).json({
                status: 'fail',
                error: 'Invalid request'
            });
        }

        if(password === ''){
            return res.status(400).json({
                status: 'fail',
                error: "password is required"
            });
        }
        if(confirmPassword === ''){
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

        if (!validate){
            return res.status(400).json({
                status: 'fail',
                error: "Password is not strong, please provide a strong password"
            });
        }

        if (password !== confirmPassword){
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
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'fail',
            error: 'Server error occurred'
        });
    }
}