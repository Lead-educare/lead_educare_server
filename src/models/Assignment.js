const {Schema, model} = require('mongoose');
const {ObjectId} = Schema.Types;

const assignmentSchema = new Schema({
    assignmentName: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'assignment name is required'],
        minLength: 3,
        maxLength: 300,
    },
    assignmentDescription: {
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

const Assignment = model('Assignment', assignmentSchema);

module.exports = Assignment;