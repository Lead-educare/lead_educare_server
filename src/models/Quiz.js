const {Schema, model} = require('mongoose');

const quizSchema = new Schema({

});

const Quiz = model('Quiz', quizSchema);

module.exports = Quiz;