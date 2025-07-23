const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.use(express.json()); // for JSON parsing

// router.get('/manage', questionController.renderManagePage);
// router.post('/add', questionController.addQuestion);
// router.post('/find', questionController.findQuestion);
// router.get('/edit/:id', questionController.renderEditPage);
// router.post('/edit/:id', questionController.updateQuestion);
// router.post('/delete/:id', questionController.deleteQuestion);


router.post('/addQuestion', questionController.addQuestion);
router.get('/questions', questionController.getAllQuestions); 
router.get('/questions/search', questionController.searchQuestions);
router.get('/questions/:id', questionController.getQuestionById); 
router.put('/questions/:id', questionController.updateQuestion); 
router.delete('/questions/:id', questionController.deleteQuestion);




router.get('/test-questions', questionController.getQuestionsForTest);

module.exports = router;
