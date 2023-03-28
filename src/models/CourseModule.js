const {Schema, model} = require('mongoose');
const {ObjectId} = Schema.Types;

const courseModuleSchema = new Schema({
    courseId: {
        type: ObjectId,
        ref: 'Course'
    },
    assignmentId: {
      type: ObjectId,
      ref: 'Assignment'
    },
    quizId: {
      type: ObjectId,
      ref: 'Quiz'
    },
    title: {
        type: String,
        trim: true
    },
    moduleNo: {
        type: Number
    }
}, {versionKey: false, timestamps: true});

const CourseModule = model('CourseModule', courseModuleSchema);

module.exports = CourseModule;