const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.use(express.json()); // for JSON parsing

router.get('/manage', questionController.renderManagePage);

router.post('/add', questionController.addQuestion);

router.post('/find', questionController.findQuestion);

router.get('/edit/:id', questionController.renderEditPage);

router.post('/edit/:id', questionController.updateQuestion);

router.post('/delete/:id', questionController.deleteQuestion);

router.get("/api/test/questions", questionController.getQuestionsForTest);

module.exports = router;
