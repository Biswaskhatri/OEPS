// routes/testRoutes.js or routes/index.js
const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.get('/test/start', testController.startTest);
router.get('/test', testController.renderTestPage);


router.post ('/test',testController.submitTest);
router.get('/test/result', testController.viewResult);

router.get("/api/test/questions", testController.getTestQuestions);

router.get('/start-test', testController.startTestAndSendQuestions);


module.exports = router;
