const {Schema, model} = require('mongoose');

const teacherSchema = new Schema({

});

const Teacher = model('Teacher', teacherSchema);

module.exports = Teacher;