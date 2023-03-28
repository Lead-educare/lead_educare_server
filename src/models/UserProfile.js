const {Schema, model} = require('mongoose');

const userProfileSchema = new Schema({

});

const UserProfile = model('UserProfile', userProfileSchema);

module.exports = UserProfile;