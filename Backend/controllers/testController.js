const Result = require('../models/result');
const Question = require('../models/questions'); 



const subjects = [
  { name: 'Math', total: 25 },
  { name: 'Physics', total: 25 },
  { name: 'Chemistry', total: 25 },
  { name: 'English', total: 15 },
  { name: 'Computer', total: 10 }
];


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

  
  const sum = levels.reduce((acc, l) => acc + levelPercent[l], 0);
  for (const level of levels) {
    levelPercent[level] = (levelPercent[level] / sum) * 100;
  }

  
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

   const lastResult = await Result.findOne({ user_id: userId, type: "full" }).sort({ test_date: -1 });


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




function calculateNormalizedScore(perSubjectDifficulty) {
  const weights = {
    Basic: 1.0,
    Intermediate: 1.5,
    Hard: 2.0
  };

  let weightedScore = 0;
  let maxWeightedScore = 0;

  for (const subject in perSubjectDifficulty) {
    const levels = perSubjectDifficulty[subject];

    for (const level in levels) {
      const { correct, total } = levels[level];
      const weight = weights[level];

      weightedScore += correct * weight;
      maxWeightedScore += total * weight;
    }
  }

  if (maxWeightedScore === 0) return 0;

  return parseFloat(((weightedScore / maxWeightedScore) * 100).toFixed(2));
}

 


exports.submitTest = async (req, res) => {
  try {
    if (!req.session.user) {
  return res.status(401).send("User session not found. Please login again.");
}
const userId = req.session.user._id;

    const submittedAnswers = req.body.answers; 

    const allPresentedQuestionIds = req.body.allPresentedQuestionIds;

   if (!allPresentedQuestionIds || allPresentedQuestionIds.length === 0) {
        return res.status(400).send("No questions were presented for this test. Missing 'allPresentedQuestionIds'.");
    }
    if (allPresentedQuestionIds.length !== 100) {
        console.warn(`Expected 100 questions, but received ${allPresentedQuestionIds.length} IDs for test submission.`);
       
    }
   

    const questions = await Question.find({
      question_id: { $in: allPresentedQuestionIds } 
    });

    if (questions.length !== allPresentedQuestionIds.length) {
      console.warn(`Mismatch: Expected ${allPresentedQuestionIds.length} questions from DB, but found ${questions.length}. Some questions might be missing or invalid.`);
      
    }


   // console.log('Submitted Answers:', req.body);



    let attempted = 0, correct = 0;
    let subjectStats = {
      Physics: { attempted: 0, correct: 0 },
      Chemistry: { attempted: 0, correct: 0 },
      Math: { attempted: 0, correct: 0 },
      English: { attempted: 0, correct: 0 },
      Computer: { attempted: 0, correct: 0 }
    };

    let difficultyStats = {
      Basic: { correct: 0, total: 0 },
      Intermediate: { correct: 0, total: 0 },
      Hard: { correct: 0, total: 0 }
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

// console.log("Submitted Question IDs:", questionIds);




    // const questions = await Question.find({
    //   $or: questionIds.map(id => ({ question_id: new RegExp(`^${id}$`, 'i') }))
    // });

// console.log("Matching question count:", questions.length);

questions.forEach(q => {
      if (!perSubjectDifficulty[q.subject] || !perSubjectDifficulty[q.subject][q.difficulty]) {
        console.warn(`Question ${q.question_id} has unexpected subject (${q.subject}) or difficulty (${q.difficulty}). Skipping for total count.`);
        return;
      }
      perSubjectDifficulty[q.subject][q.difficulty].total++;
      difficultyStats[q.difficulty].total++; // Also update overall difficulty stats
    });



    questions.forEach(q => {
      const userAnswer = submittedAnswers[q.question_id];


     // console.log(`Question ID: ${q.question_id}`);
  //console.log(`User Answer: ${userAnswer}`);
 // console.log(`Correct Answer: ${q.correct_answer}`);


      if (userAnswer) {
        attempted++;
        subjectStats[q.subject].attempted++;
        //difficultyStats[q.difficulty].total++;
        //perSubjectDifficulty[q.subject][q.difficulty].total++;

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

    let totalSeconds = 0;
    if (startTime) { // Ensure startTime exists
        const durationMs = endTime - startTime;
        totalSeconds = Math.floor(durationMs / 1000);
    }

    
    const time_to_save = totalSeconds;
    

    delete req.session.testStartTime;

    const normalized_score = calculateNormalizedScore(perSubjectDifficulty);


    // Create result document
    const result = new Result({
      user_id: userId,
      time_taken: time_to_save, 
      total_questions: 100,
      attempted,
      correct,
      subject_wise: subjectStats,
      difficulty_performance: difficultyStats,
      feedback,
      per_subject_difficulty: perSubjectDifficulty,
      type: 'full' ,
      normalized_score
    });

    await result.save();

    await updatePercentileRanks(15);

    // Store result ID in session or redirect with result ID
    req.session.lastResult = result._id;

    console.log("Last result saved:", result._id);
    await req.session.save();

   // OLD: res.redirect('/test/result');
res.status(200).json({
  success: true,
  message: "Test submitted successfully",
  resultId: result._id, 
});
  } catch (error) {
    console.error(error);
    res.status(500).send("Error submitting test");
  }
};



const updatePercentileRanks = async (rankScope = 'all') => {
  try {
    let query = Result.find({});
    let sortCriteria = { normalized_score: 1 }; 

    if (typeof rankScope === 'number' && rankScope > 0) {
      
      
      const recentSubmissions = await Result.find({})
      .sort({ test_date: -1 }) 
      .limit(rankScope)
      .lean(); 

      // Now sort these N recent submissions by normalized_score for percentile calculation
      recentSubmissions.sort((a, b) => a.normalized_score - b.normalized_score);
      
      // Use these sorted recent submissions for percentile calculation
      const allResults = recentSubmissions;
      const totalUsers = allResults.length;
      
      if (totalUsers === 0) {
        console.log("No recent results found to calculate percentile ranks.");
        return;
      }

      const bulkOperations = [];
      let i = 0;
      while (i < totalUsers) {
        const currentScore = allResults[i].normalized_score;

        let j = i;
        while (j < totalUsers && allResults[j].normalized_score === currentScore) {
          j++;
        }

        const sameScoreCount = j - i;
        const usersWithLowerScore = i;
        const percentile = ((usersWithLowerScore + 0.5 * sameScoreCount) / totalUsers) * 100;
        const roundedPercentile = parseFloat(percentile.toFixed(2));

        for (let k = i; k < j; k++) {
          bulkOperations.push({
            updateOne: {
              filter: { _id: allResults[k]._id },
              update: { $set: { percentile_rank: roundedPercentile } },
            },
          });
        }
        i = j;
      }

      if (bulkOperations.length > 0) {
        await Result.bulkWrite(bulkOperations);
        console.log(`✅ Percentile ranks updated for the last ${rankScope} test submissions.`);
      } else {
        console.log("No updates needed for percentile ranks.");
      }
      return; 
    }
    } catch (error) {
    console.error("❌ Error updating percentile ranks:", error);
  }
  }















 exports.startSubjectTest = async (req, res) => {
  try {
    const userId = req.session.user?._id || req.session.userId;
    const subject = req.query.subject;

    if (!userId || !subject) {
      return res.status(400).json({ success: false, message: "User or subject missing" });
    }

    
    const subjectQuestionCount = {
      Physics: 25,
      Chemistry: 25,
      Math: 25,
      English: 15,
      Computer: 10
    };

    const totalQuestions = subjectQuestionCount[subject];
    if (!totalQuestions) {
      return res.status(400).json({ success: false, message: "Invalid subject." });
    }

   
    let distribution = { Basic: 0.5, Intermediate: 0.3, Hard: 0.2 };

    
    const prevResult = await Result.findOne({ user_id: userId }).sort({ test_date: -1 });

    if (prevResult && prevResult.per_subject_difficulty?.[subject]) {
      const stats = prevResult.per_subject_difficulty[subject];
      const basicAcc = (stats.Basic.correct / (stats.Basic.total || 1)) * 100;
      const intAcc = (stats.Intermediate.correct / (stats.Intermediate.total || 1)) * 100;
      const hardAcc = (stats.Hard.correct / (stats.Hard.total || 1)) * 100;

      // Example logic to adjust based on previous accuracy
      if (basicAcc >= 90 && intAcc >= 80 && hardAcc >= 70) {
        distribution = { Basic: 0, Intermediate: 0.4, Hard: 0.6 };
      } else if (basicAcc >= 80 && intAcc >= 60) {
        distribution = { Basic: 0.2, Intermediate: 0.5, Hard: 0.3 };
      } else if (basicAcc < 50) {
        distribution = { Basic: 0.6, Intermediate: 0.3, Hard: 0.1 };
      }
    }

    // Calculate number of questions by difficulty
    const numBasic = Math.round(distribution.Basic * totalQuestions);
    const numIntermediate = Math.round(distribution.Intermediate * totalQuestions);
    const numHard = totalQuestions - numBasic - numIntermediate;

    const questions = [];

    for (const [level, count] of Object.entries({
      Basic: numBasic,
      Intermediate: numIntermediate,
      Hard: numHard,
    })) {
      if (count > 0) {
      const fetched = await Question.aggregate([
        { $match: { subject, difficulty: level } },
        { $sample: { size: count } },
      ]);
      questions.push(...fetched);
    }}

    res.status(200).json({
      success: true,
      questions,
      subject,
      message: `${subject} Test started successfully.`,
    });

  } catch (err) {
    console.error("Error in subject test fetch:", err);
    res.status(500).json({ success: false, message: "Failed to start subject test" });
  }
};







exports.submitSubjectTest = async (req, res) => {
  try {
    const userId = req.session.user?._id || req.session.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not logged in" });
    }

    const { subject, answers,questions: clientQuestions,timeTaken  } = req.body;
    if (!subject || !answers || ! clientQuestions) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }


    const questionIds = clientQuestions.map(q => q.question_id); 
    const dbQuestions = await Question.find({ question_id: { $in: questionIds } }).lean();

    
    const dbQuestionMap = new Map();
    dbQuestions.forEach(q => {
      dbQuestionMap.set(q.question_id, q);
    });


    let attempted = 0;
    let correct = 0;
    const difficultyCount = {
      Basic: { correct: 0, total: 0 },
      Intermediate: { correct: 0, total: 0 },
      Hard: { correct: 0, total: 0 }
    };

    for (const clientQ of clientQuestions) { 
      const dbQ = dbQuestionMap.get(clientQ.question_id); 

      
      if (!dbQ) {
        console.warn(`Question with ID ${clientQ.question_id} not found in the database. Skipping.`);
        continue;
      }

       console.log(`DB Question Options:`, dbQ.options);

      const selectedAnswer = answers[clientQ.question_id];

     
      let canonicalCorrectAnswer = dbQ.correct_answer;

       if (dbQ.options && typeof dbQ.options === 'object') {
          
          const optionValueByKey = dbQ.options[String(dbQ.correct_answer).toUpperCase()];
          
          if (optionValueByKey !== undefined) {
              canonicalCorrectAnswer = optionValueByKey; 
          }
      }

         const trimmedSelected = (selectedAnswer !== undefined && selectedAnswer !== null) ? String(selectedAnswer).trim() : '';
      const trimmedCorrect = (canonicalCorrectAnswer !== undefined && canonicalCorrectAnswer !== null) ? String(canonicalCorrectAnswer).trim() : '';


      
if (trimmedSelected !== '') { 
      attempted++;
       if (trimmedSelected === trimmedCorrect) { 
        correct++;
          
     if (dbQ.difficulty && difficultyCount[dbQ.difficulty]) { 
              difficultyCount[dbQ.difficulty].correct++;
            }
     }
    }
        
      if (dbQ.difficulty && difficultyCount[dbQ.difficulty]) { 
          difficultyCount[dbQ.difficulty].total++;
      }
    }


    const subjectWise = {
      [subject]: {
        attempted,
        correct
      }
    };

    const perSubjectDifficulty = {
      [subject]: {
        Basic: {
          correct: difficultyCount.Basic.correct,
          total: difficultyCount.Basic.total
        },
        Intermediate: {
          correct: difficultyCount.Intermediate.correct,
          total: difficultyCount.Intermediate.total
        },
        Hard: {
          correct: difficultyCount.Hard.correct,
          total: difficultyCount.Hard.total
        }
      }
    };

    const feedback = [];
      if (clientQuestions.length > 0) { 
        const accuracy = correct / clientQuestions.length;
        if (accuracy < 0.5) {
            feedback.push(`You are weak in ${subject}, please revise the subject.`);
        } else if (accuracy < 0.8) {
            feedback.push(`Improve in ${subject}, still needs some work.`);
        } else {
            feedback.push(`Great job in ${subject}, you have a good understanding of the subject.`);
        }
    } else {
        feedback.push(`No questions were found for this subject test.`);
    }

    const result = new Result({
      user_id: userId,
      subject,
      type: "subject", 
      total_questions: clientQuestions.length,
      attempted,
      correct,
      subject_wise: subjectWise,
      per_subject_difficulty: perSubjectDifficulty,
      feedback,
      test_date: new Date(),
      time_taken: timeTaken,
    });

    await result.save();

    res.status(200).json({ success: true, message: "Subject test submitted", score: correct, resultId: result._id });
  } catch (err) {
    console.error("Error in submitSubjectTest:", err);
    res.status(500).json({ success: false, message: "Failed to submit test" });
  }
}; 



 

exports.viewResult = async (req, res) => {
    try {
        const resultId = req.session.lastResult; // Assuming you stored it in session
        if (!resultId) {
            return res.status(404).send('No last result found. Please complete a test first.');
        }

        const result = await Result.findById(resultId).lean();

        if (!result) {
            return res.status(404).send('Result not found.');
        }

       
        res.status(200).json({ success: true, result });

       

    } catch (error) {
        console.error("Error viewing result:", error);
        res.status(500).send("Failed to view result.");
    }
};

exports.getAllUserResults = async (req, res) => {
  try {
    const userId = req.session.user?._id || req.session.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not logged in." });
    }
    const results = await Result.find({ user_id: userId })
                                .sort({ test_date: -1 })
                                .lean(); 

    res.status(200).json({ success: true, results });

  } catch (error) {
    console.error("Error fetching all user results:", error);
    res.status(500).json({ success: false, message: "Failed to fetch all user results." });
  }
};




exports.getSpecificResult = async (req, res) => {
    try {
        const resultId = req.params.resultId; // Get the ID from the URL parameters

        if (!resultId) {
            return res.status(400).json({ success: false, message: "Result ID is missing from the URL." });
        }

        const result = await Result.findById(resultId).lean();

        if (!result) {
            return res.status(404).json({ success: false, message: "Result not found." });
        }

        
        if (req.session.user && result.user_id.toString() !== req.session.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized access to this result." });
        }

        res.status(200).json({ success: true, result });

    } catch (error) {
        console.error("Error fetching specific result:", error);
        // MongoDB ObjectId cast errors often show up here if ID is malformed
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid Result ID format." });
        }
        res.status(500).json({ success: false, message: "Failed to fetch specific result." });
    }
};

