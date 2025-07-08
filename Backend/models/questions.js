// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question_id: String,
  question_text: String,
  options: {
    A: String,
    B: String,
    C: String,
    D: String
  },
  correct_answer: String,
  subject: String,
  difficulty: String,
  topic: String
});

module.exports = mongoose.model('Question', questionSchema);
