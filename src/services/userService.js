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


const getUserByEmailService = async (email)=>{
    const user = await User.aggregate(  [
        {$match: {email } }
    ] );
    return user[0]
};

const passwordUpdateService = async (email, hash)=>{
    return User.updateOne(
        {email: email},
        {$set: {
                password: hash
            }}
    );
}

const userProfileUpdateService = async (_id, firstName, lastName)=>{
    const result = await User.updateOne({_id: ObjectId(_id)}, {$set: {
            firstName,
            lastName,
        }}, {runValidators: true});

    return result;
}

module.exports = {
    findUserByProperty, createNewUser, getUserByEmailService, passwordUpdateService, userProfileUpdateService
}