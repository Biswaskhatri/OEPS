const Result = require('../models/result');
const Question = require('../models/questions'); 



const subjects = [
  { name: 'Math', total: 25 },
  { name: 'Physics', total: 25 },
  { name: 'Chemistry', total: 25 },
  { name: 'English', total: 15 },
  { name: 'Computer', total: 10 }
];

// Reuse your logic function from earlier
function calculateDifficultyDistribution(previousStats, totalQuestions) {
  const levels = ['Basic', 'Intermediate', 'Hard'];
  let levelPercent = {
    Basic: 50,
    Intermediate: 30,
    Hard: 20
  };

  if (previousStats) {
    const basic = previousStats.Basic;
    const inter = previousStats.Intermediate;

    const basicAccuracy = basic.total > 0 ? (basic.correct / basic.total) * 100 : 0;
    const interAccuracy = inter.total > 0 ? (inter.correct / inter.total) * 100 : 0;

    // Apply your custom rules
    if (basicAccuracy === 100 && interAccuracy === 100) {
      levelPercent = { Basic: 0, Intermediate: 0, Hard: 100 };
    } else if (basicAccuracy >= 50 && basicAccuracy < 75 && interAccuracy >= 0) {
      levelPercent = { Basic: 20, Intermediate: 60, Hard: 20 };
    } else if (basicAccuracy < 50) {
      levelPercent = { Basic: 50, Intermediate: 30, Hard: 20 };
    } else if (basicAccuracy === 100 && interAccuracy > 50) {
      levelPercent = { Basic: 0, Intermediate: 25, Hard: 75 };
    } else if (basicAccuracy === 100 && interAccuracy <= 50) {
      levelPercent = { Basic: 0, Intermediate: 50, Hard: 50 };
    } else if (basicAccuracy >= 50 && interAccuracy < 50) {
      levelPercent = { Basic: 20, Intermediate: 60, Hard: 20 };
    } else if (basicAccuracy >= 50 && interAccuracy > 50) {
      levelPercent = { Basic: 10, Intermediate: 40, Hard: 50 };
    }else if (basicAccuracy >= 80 && interAccuracy >= 80) {
      levelPercent = { Basic: 10, Intermediate: 10, Hard: 80 };
    }
    // else fallback to default
  }

  // Normalize percentage to sum to 100 (optional but good for rounding safety)
  const sum = levels.reduce((acc, l) => acc + levelPercent[l], 0);
  for (const level of levels) {
    levelPercent[level] = (levelPercent[level] / sum) * 100;
  }

  // Convert percentages to actual counts
  const rawCounts = {};
  let totalAssigned = 0;

  for (const level of levels) {
    rawCounts[level] = Math.floor((levelPercent[level] / 100) * totalQuestions);
    totalAssigned += rawCounts[level];
  }

  // Adjust for rounding errors to ensure total is exactly totalQuestions
  while (totalAssigned < totalQuestions) {
    for (const level of ['Hard', 'Intermediate', 'Basic']) {
      rawCounts[level]++;
      totalAssigned++;
      if (totalAssigned === totalQuestions) break;
    }
  }

  return rawCounts;
}


// Main controller to create and start test
exports.startTest = async (req, res) => {
  try {
    const userId = req.session.userId;
    const allQuestions = [];


    const subjects = [
  { name: 'Math', total: 25 },
  { name: 'Physics', total: 25 },
  { name: 'Chemistry', total: 25 },
  { name: 'English', total: 15 },
  { name: 'Computer', total: 10 }
];
  

  const lastResult = await Result.findOne({ user_id: userId }).sort({ test_date: -1 });
  console.log("Last result for user:", lastResult);

    for (const subject of subjects) {

      const previousStats = lastResult?.per_subject_difficulty?.[subject.name]
  ? {
      Basic: {
        correct: lastResult.per_subject_difficulty[subject.name].Basic.correct || 0,
        total: lastResult.per_subject_difficulty[subject.name].Basic.total || 0
      },
      Intermediate: {
        correct: lastResult.per_subject_difficulty[subject.name].Intermediate.correct || 0,
        total: lastResult.per_subject_difficulty[subject.name].Intermediate.total || 0
      },
      Hard: {
        correct: lastResult.per_subject_difficulty[subject.name].Hard.correct || 0,
        total: lastResult.per_subject_difficulty[subject.name].Hard.total || 0
      }
    }
  : null;


    console.log(`Calculating distribution for ${subject.name}...`, previousStats);



      const distribution = calculateDifficultyDistribution(previousStats, subject.total);

      const fetched = [];
      for (const level of ['Basic', 'Intermediate', 'Hard']) {
        if (distribution[level] > 0) {
          const questions = await Question.aggregate([
            { $match: { subject: subject.name, difficulty: level } },
            { $sample: { size: distribution[level] } }
          ]);
          fetched.push(...questions);
        }
        }   
          console.log(`Questions fetched for ${subject.name}:`, fetched.length);

      allQuestions.push(...fetched);
    }

    console.log("Fetched questions:", allQuestions.length);

   
      const uniqueQuestionsMap = new Map();
      allQuestions.forEach(q => {
        uniqueQuestionsMap.set(q.question_id, q);
      });

      let uniqueQuestions = Array.from(uniqueQuestionsMap.values());

      // If fewer than 100, fetch more to fill
      if (uniqueQuestions.length < 100) {
        const missing = 100 - uniqueQuestions.length;
        console.log(`Only ${uniqueQuestions.length} unique questions found. Fetching ${missing} more...`);

        const extraQuestions = await Question.aggregate([
          { $match: { question_id: { $nin: uniqueQuestions.map(q => q.question_id) } } },
          { $sample: { size: missing } }
        ]);

        // Add extra unique ones
        extraQuestions.forEach(q => {
          if (!uniqueQuestionsMap.has(q.question_id)) {
            uniqueQuestionsMap.set(q.question_id, q);
          }
        });

        uniqueQuestions = Array.from(uniqueQuestionsMap.values());
      }

      console.log("Total unique questions after removing duplicates:", uniqueQuestions.length);


    // Store ordered questions in session and redirect to test page
    req.session.testQuestions = uniqueQuestions;
    req.session.testStartTime = Date.now();

    res.redirect('/test');
  } catch (err) {
    console.error('Error starting test:', err);
    res.status(500).send('Failed to start test. Please try again.');
  }
};




exports.renderTestPage = (req, res) => {
  const testQuestions = req.session.testQuestions;

  if (!testQuestions || testQuestions.length === 0) {
    return res.send("No questions found in session. Please restart the test.");
  }
//console.log("Session testQuestions:", req.session.testQuestions);
res.render('test', {
  testQuestions,
  currentPage: 'test', // tells navbar which tab is active
  isLoggedIn: req.session.isLoggedIn || false,
  user: req.session.user || null
});

};

// Send test questions to React
exports.getTestQuestions = (req, res) => {
  const questions = req.session.testQuestions;

  if (!questions || questions.length === 0) {
    return res.status(404).json({ success: false, message: "No questions found. Start test first." });
  }

  res.status(200).json({ success: true, questions });
};



// In your testController.js
exports.startTestAndSendQuestions = async (req, res) => {
  try {
    const userId = req.session.user?._id || req.session.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not logged in." });
    }

    const allQuestions = [];

    const lastResult = await Result.findOne({ user_id: userId }).sort({ test_date: -1 });

    for (const subject of subjects) {
      const previousStats = lastResult?.per_subject_difficulty?.[subject.name] || null;

      const distribution = calculateDifficultyDistribution(previousStats, subject.total);

      const fetched = [];

      for (const level of ['Basic', 'Intermediate', 'Hard']) {
        if (distribution[level] > 0) {
          const questions = await Question.aggregate([
            { $match: { subject: subject.name, difficulty: level } },
            { $sample: { size: distribution[level] } }
          ]);
          fetched.push(...questions);
        }
      }

      allQuestions.push(...fetched);
    }

    const uniqueQuestionsMap = new Map();
    allQuestions.forEach(q => uniqueQuestionsMap.set(q.question_id, q));

    let uniqueQuestions = Array.from(uniqueQuestionsMap.values());

    if (uniqueQuestions.length < 100) {
      const missing = 100 - uniqueQuestions.length;
      const extraQuestions = await Question.aggregate([
        { $match: { question_id: { $nin: uniqueQuestions.map(q => q.question_id) } } },
        { $sample: { size: missing } }
      ]);
      extraQuestions.forEach(q => {
        if (!uniqueQuestionsMap.has(q.question_id)) {
          uniqueQuestionsMap.set(q.question_id, q);
        }
      });
      uniqueQuestions = Array.from(uniqueQuestionsMap.values());
    }

    req.session.testQuestions = uniqueQuestions;
    req.session.testStartTime = Date.now();

    res.status(200).json({
      success: true,
      questions: uniqueQuestions,
      message: "Test started successfully"
    });

  } catch (err) {
    console.error('Error starting test:', err);
    res.status(500).json({ success: false, message: 'Failed to start test' });
  }
};


 








exports.submitTest = async (req, res) => {
  try {
    if (!req.session.user) {
  return res.status(401).send("User session not found. Please login again.");
}
const userId = req.session.user._id;

    const submittedAnswers = req.body.answers; // { question_id: selected_option }


   

    console.log('Submitted Answers:', req.body);



    let attempted = 0, correct = 0;
    let subjectStats = {
      Physics: { attempted: 0, correct: 0 },
      Chemistry: { attempted: 0, correct: 0 },
      Math: { attempted: 0, correct: 0 },
      English: { attempted: 0, correct: 0 },
      Computer: { attempted: 0, correct: 0 }
    };
    let difficultyStats = {
      Basic: { correct: 0 },
      Intermediate: { correct: 0 },
      Hard: { correct: 0 }
    };

       let perSubjectDifficulty = {
        Physics: { Basic: { correct: 0, total: 0 }, Intermediate: { correct: 0, total: 0 }, Hard: { correct: 0, total: 0 } },
        Chemistry: { Basic: { correct: 0, total: 0 }, Intermediate: { correct: 0, total: 0 }, Hard: { correct: 0, total: 0 } },
        Math: { Basic: { correct: 0, total: 0 }, Intermediate: { correct: 0, total: 0 }, Hard: { correct: 0, total: 0 } },
        English: { Basic: { correct: 0, total: 0 }, Intermediate: { correct: 0, total: 0 }, Hard: { correct: 0, total: 0 } },
        Computer: { Basic: { correct: 0, total: 0 }, Intermediate: { correct: 0, total: 0 }, Hard: { correct: 0, total: 0 } }
      };


    // Get all relevant questions from DB at once
    const questionIds = Object.keys(submittedAnswers);

console.log("Submitted Question IDs:", questionIds);




    const questions = await Question.find({
      $or: questionIds.map(id => ({ question_id: new RegExp(`^${id}$`, 'i') }))
    });

console.log("Matching question count:", questions.length);

    questions.forEach(q => {
      const userAnswer = submittedAnswers[q.question_id];


      console.log(`Question ID: ${q.question_id}`);
  console.log(`User Answer: ${userAnswer}`);
  console.log(`Correct Answer: ${q.correct_answer}`);


      if (userAnswer) {
        attempted++;
        subjectStats[q.subject].attempted++;
        perSubjectDifficulty[q.subject][q.difficulty].total++;

        console.log(`Checking ${q.question_id}: user=${userAnswer} vs actual=${q.correct_answer}`);

      const isCorrect = q.subject === 'Math'
            ? q.options[userAnswer] === q.correct_answer // compare value
            : userAnswer === q.correct_answer;           // compare key

          if (isCorrect) {
            correct++;
            subjectStats[q.subject].correct++;
            difficultyStats[q.difficulty].correct++;
            perSubjectDifficulty[q.subject][q.difficulty].correct++;
          }
        }
      });


    const previousResult = await Result.findOne({ user_id: userId }).sort({ test_date: -1 });

    // Feedback logic
   const feedback = [];

      for (let subject in subjectStats) {
        const { attempted, correct } = subjectStats[subject];
        const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
      
       
        if (previousResult && previousResult.subject_wise[subject]) {
          const prev = previousResult.subject_wise[subject];
          const prevAccuracy = prev.attempted > 0 ? (prev.correct / prev.attempted) * 100 : 0;

          if (accuracy > prevAccuracy + 10) {
            feedback.push(`Great job! You improved in ${subject} compare to last test.`);
          } else if (accuracy < prevAccuracy - 10) {
            feedback.push(`Your performance in ${subject} dropped this time. Try to revise.`);
          } else {
            feedback.push(`Your ${subject} performance is consistent.`);
          }
        }

        else{

        if (accuracy >= 80) {
          feedback.push(`You're strong in ${subject}`);
        } else if (accuracy >= 50) {
          feedback.push(`You did okay in ${subject}, but can improve`);
        } else {
          feedback.push(`You need to focus more on ${subject}`);
        }
      }}


      const startTime = req.session.testStartTime;
      const endTime = Date.now(); // current time

      
      const durationMs = endTime - startTime;

      // Convert to minutes and seconds
      const totalSeconds = Math.floor(durationMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

    
      const time_taken = minutes >= 60 
        ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
        : `${minutes}m ${seconds}s`;

      delete req.session.testStartTime;



    // Create result document
    const result = new Result({
      user_id: userId,
      time_taken, // ← for now, hardcoded; later, calculate from timer
      total_questions: 100,
      attempted,
      correct,
      subject_wise: subjectStats,
      difficulty_performance: difficultyStats,
      feedback,
      per_subject_difficulty: perSubjectDifficulty
    });

    await result.save();

    // Store result ID in session or redirect with result ID
    req.session.lastResult = result._id;

    console.log("Last result saved:", result._id);
    await req.session.save();

    res.redirect('/test/result');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error submitting test");
  }
};




    exports.viewResult = async (req, res) => {
      try {
        const resultId = req.session.lastResult;

        if (!resultId) {
          return res.status(404).send("No recent result found in session.");
        }

        const result = await Result.findById(resultId).populate('user_id');

        if (!result) {
          return res.status(404).send("Result not found.");
        }

        console.log("Session lastResult ID:", req.session.lastResult);
    console.log("Fetched result from DB:", result);


       res.render('result', {
  result: result.toObject(),
  currentPage: 'result',
  isLoggedIn: req.session.isLoggedIn || false,
  user: req.session.user || null
});

      } catch (err) {
        console.error(err);
        res.status(500).send("Error loading result");
      }
    };
