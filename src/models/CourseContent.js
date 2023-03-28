const {Schema, model} = require('mongoose');

const courseContentSchema = new Schema({
    courseModuleId: {
        type: Schema.Types.ObjectId,
        ref: 'CourseModule'
    },
    videoTitle: {
        type: String,
        trim: true
    },
    videoUrl: {
        type: URL,
        trim: true
    }
}, {versionKey: false, timestamps: true});

const CourseContent = model('CourseContent', courseContentSchema);

module.exports = CourseContent;