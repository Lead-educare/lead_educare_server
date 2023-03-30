const manageUserService = require('../../services/admin/manageUserService');
const getAllUsers = async (req, res, next)=>{
    try {
        const users = await manageUserService.getAllUsersService();
        res.status(200).json(users)
    }catch (e) {
        next(e);
    }
}

module.exports = {getAllUsers}