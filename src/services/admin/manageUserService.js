const User = require('../../models/User');
const getAllUsersService = ()=>{
    return User.aggregate([
        {$match: {}},
        {$lookup: { from: 'roles', localField: 'roleId', foreignField: '_id', as: 'role' }},
        {$project: {email:1, mobile: 1, firstName: 1, lastName: 1, status: 1, verified: 1, createdAt:1, updatedAt:1, 'role.name': 1}}
    ])
}

module.exports = {getAllUsersService}