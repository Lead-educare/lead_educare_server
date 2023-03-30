const {Schema, model} = require('mongoose');

const userProfileSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    avatar: {
        type: String,
        default: ''
    }
}, {versionKey: false, timestamps: true});

const UserProfile = model('UserProfile', userProfileSchema);

module.exports = UserProfile;