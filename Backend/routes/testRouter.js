// routes/testRoutes.js or routes/index.js
const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.get('/test/start', testController.startTest);



router.post ('/submit-test',testController.submitTest);
 

router.get('/test/result', testController.viewResult);

router.get("/api/test/questions", testController.getTestQuestions);

router.get('/start-test', testController.startTestAndSendQuestions);

router.get('/subject-test', testController.startSubjectTest);

router.post("/submit-subject-test", testController.submitSubjectTest);



router.get('/all-results', testController.getAllUserResults);

router.get('/result/:resultId', testController.getSpecificResult);
module.exports = router;
