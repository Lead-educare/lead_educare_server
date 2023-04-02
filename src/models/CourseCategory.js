const {Schema, model} = require('mongoose');
const slugify = require("slugify");

const courseCategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'category name is required'],
        lowercase: true,
        minLength: [3, 'category name must be 3 character'],
        maxLength: [100, 'Course name is too large'],
    },
    slug: {
        type: String,
        lowercase: true
    }

}, {versionKey: false, timestamps: true});

courseCategorySchema.pre('save', function (next) {
    this.slug = slugify(this.name);
    next();
})

const CourseCategory = model('CourseCategory', courseCategorySchema);

module.exports = CourseCategory;