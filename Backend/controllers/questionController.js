const Question = require('../models/questions');


// GET: API to get random questions for test
exports.getQuestionsForTest = async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 100 } }]);
    res.status(200).json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching questions', error: err.message });
  }
};



// GET: Manage Page
exports.renderManagePage = (req, res) => {
  const user = req.session.user;

  if (!user || user.role !== 'admin') {
    return res.status(403).render('errorPage', {
      errorMessage: "Access denied. Only admin can access this page.",
      currentPage: 'manage',
      isLoggedIn: req.session.isLoggedIn || false,
      user
    });
  }

  res.render('manage', {
    message: null,
    currentPage: 'manage',
    isLoggedIn: req.session.isLoggedIn || false,
    user: req.session.user || null
  });
};



// POST: Add New Question
exports.addQuestion = async (req, res) => {
  
  const user = req.session.user;

  if (!user || user.role !== 'admin') {
    return res.status(403).render('errorPage', {
      errorMessage: "Access denied. Only admin can access this page.",
      currentPage: 'manage',
      isLoggedIn: req.session.isLoggedIn || false,
      user
    });
  }
  try {
    await Question.create(req.body);
    console.log('Form data received:', req.body);
    res.render('manage', { message: 'Question added successfully!',
      currentPage: 'manage', 
      isLoggedIn: req.session.isLoggedIn || false,
      user: req.session.user || null
     });
  } catch (err) {
    res.status(500).send('Error adding question');
  }
};

// POST: Find Question by subject and question_id
exports.findQuestion = async (req, res) => {

const user = req.session.user;

  if (!user || user.role !== 'admin') {
    return res.status(403).render('errorPage', {
      errorMessage: "Access denied. Only admin can access this page.",
      currentPage: 'manage',
      isLoggedIn: req.session.isLoggedIn || false,
      user
    });
  }
  const { subject, question_id } = req.body;
  try {
    const question = await Question.findOne({
      subject: { $regex: new RegExp(`^${subject}$`, 'i') },
      question_id: { $regex: new RegExp(`^${question_id}$`, 'i') }
    });

    if (!question) return res.send('Question not found');
    res.redirect(`/questions/edit/${question._id}`);
  } catch (err) {
    res.status(500).send('Error finding question');
  }
};

// GET: View Specific Question for Update/Delete
exports.renderEditPage = async (req, res) => {

const user = req.session.user;

  if (!user || user.role !== 'admin') {
    return res.status(403).render('errorPage', {
      errorMessage: "Access denied. Only admin can access this page.",
      currentPage: 'manage',
      isLoggedIn: req.session.isLoggedIn || false,
      user
    });
  }

  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.send('Question not found');
   res.render('edit', {
  question,
  currentPage: 'manage',
  isLoggedIn: req.session.isLoggedIn || false,
  user: req.session.user || null
});

  } catch (err) {
    res.status(500).send('Error loading question');
  }
};

// POST: Update Question
exports.updateQuestion = async (req, res) => {

const user = req.session.user;

 if (!user || user.role !== 'admin') {
    return res.status(403).render('errorPage', {
      errorMessage: "Access denied. Only admin can access this page.",
      currentPage: 'manage',
      isLoggedIn: req.session.isLoggedIn || false,
      user
    });
  }

  try {
    await Question.findByIdAndUpdate(req.params.id, req.body);
    res.render('manage', {
  message: 'Question updated successfully!',
  currentPage: 'manage',
  isLoggedIn: req.session.isLoggedIn || false,
  user: req.session.user || null
});

  } catch (err) {
    res.status(500).send('Error updating question');
  }
};

// POST: Delete Question
exports.deleteQuestion = async (req, res) => {

const user = req.session.user;
if (!user || user.role !== 'admin') {
    return res.status(403).render('errorPage', {
      errorMessage: "Access denied. Only admin can access this page.",
      currentPage: 'manage',
      isLoggedIn: req.session.isLoggedIn || false,
      user
    });
  }

  try {
    await Question.findByIdAndDelete(req.params.id);
    res.render('manage', {
  message: 'Question deleted successfully!',
  currentPage: 'manage',
  isLoggedIn: req.session.isLoggedIn || false,
  user: req.session.user || null
});

  } catch (err) {
    res.status(500).send('Error deleting question');
  }
};
