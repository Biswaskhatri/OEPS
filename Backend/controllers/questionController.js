const Question = require('../models/questions');

const checkAdminAccess = (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        res.status(403).json({ success: false, message: "Access denied. Only admin can access this page." });
        return false;
    }
    return true;
};



exports.getQuestionsForTest = async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 100 } }]);
    res.status(200).json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching questions', error: err.message });
  }
};



exports.getAllQuestions = async (req, res) => {
    if (!checkAdminAccess(req, res)) return;

    try {
        const questions = await Question.find({}); // Fetch all questions
        res.status(200).json({ success: true, questions });
    } catch (err) {
        console.error("Error fetching all questions for admin:", err);
        res.status(500).json({ success: false, message: 'Error fetching all questions', error: err.message });
    }
};




exports.getQuestionById = async (req, res) => {
    if (!checkAdminAccess(req, res)) return;

    try {
        const { id } = req.params;
        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        res.status(200).json({ success: true, question });
    } catch (err) {
        console.error("Error fetching specific question by ID:", err);
       
        res.status(500).json({ success: false, message: 'Error loading question', error: err.message });
    }
};






exports.addQuestion = async (req, res) => {
  
  if (!checkAdminAccess(req, res)) return;

  try {
        const newQuestion = await Question.create(req.body);
        console.log('New question added:', newQuestion);
        res.status(201).json({ success: true, message: 'Question added successfully!', question: newQuestion });
    } catch (err) {
        console.error("Error adding question:", err);
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Validation Error', errors: err.errors });
        }
        res.status(500).json({ success: false, message: 'Error adding question', error: err.message });
    }
};



exports.updateQuestion = async (req, res) => {
    if (!checkAdminAccess(req, res)) return;

    try {
        const { id } = req.params;
        const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }); // `new: true` returns updated doc, `runValidators` runs schema validators

        if (!updatedQuestion) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        res.status(200).json({ success: true, message: 'Question updated successfully!', question: updatedQuestion });
    } catch (err) {
        console.error("Error updating question:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: 'Validation Error', errors: err.errors });
        }
        res.status(500).json({ success: false, message: 'Error updating question', error: err.message });
    }
};




exports.deleteQuestion = async (req, res) => {
    if (!checkAdminAccess(req, res)) return;

    try {
        const { id } = req.params;
        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        res.status(200).json({ success: true, message: 'Question deleted successfully!', question: deletedQuestion });
    } catch (err) {
        console.error("Error deleting question:", err);
        res.status(500).json({ success: false, message: 'Error deleting question', error: err.message });
    }
};




exports.searchQuestions = async (req, res) => {
    if (!req.session.isLoggedIn || req.session.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    const { subject, question_id } = req.query;
    const query = {};

    if (subject) {
        query.subject = subject;
    }
    if (question_id) {
        query.question_id = question_id;
    }

    try {
        const questions = await Question.find(query);
        res.status(200).json({ success: true, questions });
    } catch (error) {
        console.error('Error searching questions:', error);
        res.status(500).json({ success: false, message: 'Failed to search questions', error: error.message });
    }
};










// // POST: Find Question by subject and question_id
// exports.findQuestion = async (req, res) => {

// const user = req.session.user;

//   if (!user || user.role !== 'admin') {
//     return res.status(403).render('errorPage', {
//       errorMessage: "Access denied. Only admin can access this page.",
//       currentPage: 'manage',
//       isLoggedIn: req.session.isLoggedIn || false,
//       user
//     });
//   }
//   const { subject, question_id } = req.body;
//   try {
//     const question = await Question.findOne({
//       subject: { $regex: new RegExp(`^${subject}$`, 'i') },
//       question_id: { $regex: new RegExp(`^${question_id}$`, 'i') }
//     });

//     if (!question) return res.send('Question not found');
//     res.redirect(`/questions/edit/${question._id}`);
//   } catch (err) {
//     res.status(500).send('Error finding question');
//   }
// };

// // GET: View Specific Question for Update/Delete
// exports.renderEditPage = async (req, res) => {

// const user = req.session.user;

//   if (!user || user.role !== 'admin') {
//     return res.status(403).render('errorPage', {
//       errorMessage: "Access denied. Only admin can access this page.",
//       currentPage: 'manage',
//       isLoggedIn: req.session.isLoggedIn || false,
//       user
//     });
//   }

//   try {
//     const question = await Question.findById(req.params.id);
//     if (!question) return res.send('Question not found');
//    res.render('edit', {
//   question,
//   currentPage: 'manage',
//   isLoggedIn: req.session.isLoggedIn || false,
//   user: req.session.user || null
// });

//   } catch (err) {
//     res.status(500).send('Error loading question');
//   }
// };

// // POST: Update Question
// exports.updateQuestion = async (req, res) => {

// const user = req.session.user;

//  if (!user || user.role !== 'admin') {
//     return res.status(403).render('errorPage', {
//       errorMessage: "Access denied. Only admin can access this page.",
//       currentPage: 'manage',
//       isLoggedIn: req.session.isLoggedIn || false,
//       user
//     });
//   }

//   try {
//     await Question.findByIdAndUpdate(req.params.id, req.body);
//     res.render('manage', {
//   message: 'Question updated successfully!',
//   currentPage: 'manage',
//   isLoggedIn: req.session.isLoggedIn || false,
//   user: req.session.user || null
// });

//   } catch (err) {
//     res.status(500).send('Error updating question');
//   }
// };

// // POST: Delete Question
// exports.deleteQuestion = async (req, res) => {

// const user = req.session.user;
// if (!user || user.role !== 'admin') {
//     return res.status(403).render('errorPage', {
//       errorMessage: "Access denied. Only admin can access this page.",
//       currentPage: 'manage',
//       isLoggedIn: req.session.isLoggedIn || false,
//       user
//     });
//   }

//   try {
//     await Question.findByIdAndDelete(req.params.id);
//     res.render('manage', {
//   message: 'Question deleted successfully!',
//   currentPage: 'manage',
//   isLoggedIn: req.session.isLoggedIn || false,
//   user: req.session.user || null
// });

//   } catch (err) {
//     res.status(500).send('Error deleting question');
//   }
// };
