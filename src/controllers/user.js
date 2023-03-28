exports.getUserProfile = async (req, res)=>{
    try {
        const user = await getUserByEmailService(req.auth?.email);

        if (!user){
            return res.status(401).json({
                status: 'fail',
                error: 'User not found'
            });
        }

        delete user.password;

        res.status(200).json({
            status: 'success',
            user
        })

    }catch (error) {
        console.log(error)
        res.status(401).json({
            status: 'fail',
            error: 'Server error occurred'
        })
    }
};

exports.patchUser = async (req, res)=>{
    try {

        const {firstName, lastName} = req.body;

        const result = await userProfileUpdateService(req.auth?._id, firstName, lastName);

        res.status(200).json({
            result
        })
    }catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'fail',
            error: 'Server error occurred'
        });
    }
}