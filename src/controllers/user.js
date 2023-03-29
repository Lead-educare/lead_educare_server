const userService = require('../services/userService');

exports.getUserProfile = async (req, res, next)=>{
    try {
        const user = await userService.findUserByProperty('email', req.auth?.email);

        if (!user){
            return res.status(401).json({
                status: 'fail',
                error: 'User not found'
            });
        }

        delete user.password;

        res.status(200).json({
            user
        })

    }catch (e) {
        console.log(e)
        next(e)
    }
};

exports.patchUser = async (req, res, next)=>{
    try {

        const {firstName, lastName} = req.body;
        const isUpdate = await userService.userProfileUpdateService(req.auth?._id, firstName, lastName);

        if (isUpdate.modifiedCount === 0){
            return res.status(200).json({
                message: 'profile not update'
            })
        }
        res.status(200).json({
            message: 'profile update successfully'
        })
    }catch (e) {
        next(e)
    }
};

exports.patchUser = async (req, res, next)=>{
    try {
        const {firstName, lastName} = req.body;

        const result = await userService.userProfileUpdateService(req.auth?._id, firstName, lastName);

        res.status(200).json({
            result
        })
    }catch (e) {
        next(e)
    }
}