const {Schema, model} = require('mongoose');

const teacherProfileSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId
    },
    designation: {
      type: String
    },
    about: {
        type: String
    },
    avatar: {
        type: String,
        default: ''
    }
}, {versionKey: false, timestamps: true});

const TeacherProfile = model('TeacherProfile', teacherProfileSchema);

module.exports = TeacherProfile;