const User = require("../models/User");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const findUserByProperty = (key, value) => {
    if (key === '_id') {
        return User.findById(value);
    }
    return User.findOne({ [key]: value });
};

const createNewUser = (
    {email, mobile, firstName, lastName, password, confirmPassword}
)=>{
    const user = new User({email, mobile, firstName, lastName, password, confirmPassword});
    return user.save();
}
const passwordUpdateService = async ({email, hash, options = null})=>{
    if (options !== null){
        return User.updateOne(
            {email: email},
            {$set: {
                    password: hash
                }}, {options}
        );
    }
    return User.updateOne(
        {email: email},
        {$set: {
                password: hash
            }}
    );
}

const userProfileUpdateService = async (_id, firstName, lastName)=>{
    return User.updateOne({_id: ObjectId(_id)}, {$set: {
            firstName,
            lastName,
        }}, {runValidators: true});
}

module.exports = {
    findUserByProperty, createNewUser, passwordUpdateService, userProfileUpdateService
}