const User = require("../models/User");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const findUserByProperty = (key, value, projection = null) => {
    if (key === '_id') {
        if (projection !== null){
            return User.findById(value, projection);
        }
        return User.findById(value);
    }
    if (projection !== null){
        return User.findOne({ [key]: value }, projection);
    }
    return User.findOne({ [key]: value });
};

const createNewUser = (
    {email, mobile, firstName, lastName, password, confirmPassword, roles}
)=>{
    const user = new User({email, mobile, firstName, lastName, password, confirmPassword, roles});
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

module.exports = {
    findUserByProperty, createNewUser, passwordUpdateService, userProfileUpdateService
}