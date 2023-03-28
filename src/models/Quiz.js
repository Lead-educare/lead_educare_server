const {Schema, model} = require('mongoose');

const {ObjectId} = Schema.Types;

const quizSchema = new Schema({
    quizName: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'assignment name is required'],
        minLength: 3,
        maxLength: 300,
    },
    quizDescription: {
        type: String
    },
    status: {
        type: String,
        enum: ['PENDING', 'REJECT', 'APPROVED']
    },
    teacherReview: {
        type: String
    },
    mark: {
        type: Number
    },
    courseId: {
        type: ObjectId,
        ref: 'Course'
    },
    teacherId: {
        type: ObjectId,
        ref: 'Teacher'
    },
    courseModuleId: {
        type: ObjectId,
        ref: 'CourseModule'
    }

}, {versionKey: false, timestamps: true});

const Quiz = model('Quiz', quizSchema);

module.exports = Quiz;