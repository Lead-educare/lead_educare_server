const User = require("../models/User");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const findUserByProperty = async (key, value, projection = null) => {
    if (projection !== null){
        const user = await User.aggregate([
            {$match: {[key]: value}},
            {$lookup: {from: 'roles', localField: 'roleId', foreignField: '_id', as: 'role'}},
            {$unwind: '$role'},
            {$lookup: {from: 'permissions', localField: 'role.permissions', foreignField: '_id', as: 'permissions'}},
            {$project: projection}
        ]);
        return user[0]
    }

    const user = await User.aggregate([
        {$match: {[key]: value}},
        {$lookup: {from: 'roles', localField: 'roleId', foreignField: '_id', as: 'role'}},
        {$unwind: '$role'},
        {$lookup: {from: 'permissions', localField: 'role.permissions', foreignField: '_id', as: 'permissions'}},
    ]);
    return user[0]
};

const createNewUser = (
    {email, mobile, firstName, lastName, password, confirmPassword, roleId}
)=>{
    const user = new User({email, mobile, firstName, lastName, password, confirmPassword, roleId});
    return user.save();
}

const passwordUpdateService = async ({email, hash, options = null})=> {
    if (options !== null) {
        return User.updateOne(
            {email: email},
            {
                $set: {
                    password: hash
                }
            }, {options}
        );
    }
}

const userProfileUpdateService = async (_id, firstName, lastName)=>{

    return User.updateOne({_id: ObjectId(_id)}, {$set: {
            firstName,
            lastName,
        }}, {runValidators: true});
}
const userUpdateService = async (query, updateObj, options = null)=>{

    if(options !== null){
        return User.updateOne(query, updateObj, {runValidators: true, ...options});
    }

    return User.updateOne(query, updateObj, {runValidators: true});
}

module.exports = {
    findUserByProperty, createNewUser, passwordUpdateService, userProfileUpdateService, userUpdateService
}