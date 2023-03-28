const {Schema, model} = require('mongoose');

const assignmentSchema = new Schema({

});

const Assignment = model('Assignment', assignmentSchema);

module.exports = Assignment;