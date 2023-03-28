const {Schema, model} = require('mongoose');

const userProfileSchema = new Schema({
    avatar: {
        type: String,
        default: ''
    }
}, {versionKey: false, timestamps: true});

const UserProfile = model('UserProfile', userProfileSchema);

module.exports = UserProfile;