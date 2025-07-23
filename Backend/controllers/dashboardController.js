const mongoose = require('mongoose');

const Test = require('../models/test'); 
const User = require('../models/user');
const Result = require('../models/result');


exports.getLatestUserResult = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.session.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    const userId = req.session.user._id;

    // Find the latest test result for the current user
    const latestResult = await Result.findOne({ user_id: userId })
      .sort({ test_date: -1 }) // Sort by most recent test date
      .select('normalized_score percentile_rank test_date feedback') // Select only the fields you need for the dashboard
      .lean(); // Use .lean() for performance

    if (!latestResult) {
      return res.status(404).json({ message: "No test results found for this user." });
    }

    // Send the latest result data back to the client
    res.status(200).json({
      success: true,
      message: "Latest result fetched successfully.",
      result: latestResult
    });

  } catch (error) {
    console.error("Error fetching latest user result:", error);
    res.status(500).json({ message: "Error fetching user result.", error: error.message });
  }
};




exports.debugLatestResult = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    const userId = req.session.user._id;
    console.log(`DEBUG_ENDPOINT: Fetching latest result for userId: ${userId}`);

    const latestResult = await Result.findOne({ user_id: new mongoose.Types.ObjectId(userId) })
      .sort({ test_date: -1 })
      .select('normalized_score percentile_rank test_date feedback')
      .lean();

    console.log("DEBUG_ENDPOINT: latestResult directly fetched:", latestResult);

    res.status(200).json({
      success: true,
      data: latestResult // Return it directly
    });

  } catch (error) {
    console.error("DEBUG_ENDPOINT: Error fetching latest result:", error);
    res.status(500).json({ message: "Error fetching latest result.", error: error.message });
  }
};






// exports.getDashboardSummary = async (req, res) => {


//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ message: "User not authenticated." });
//     }
//     const userId = req.session.user._id;

//     console.log(`DEBUG: Fetching dashboard summary for userId: ${userId}`);

//     // Fetch user details
//     const user = await User.findById(userId).select('-password').lean(); // Use .lean() for performance

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }


//      const totalTestsTaken = await Result.countDocuments({ user_id: userId });

//     // Average Normalized Score & Last Test Date
//     let averageScore = 0;
//     let lastTestDate = 'N/A';
//     let latestTestResult = null; 

//     if (totalTestsTaken > 0) {
//       // Aggregate to calculate average score
//       const avgScoreResult = await Result.aggregate([
//         { $match: { user_id: new mongoose.Types.ObjectId(userId) } }, // Match by userId
//         {
//           $group: {
//             _id: null, // Group all matching documents
//             averageScore: { $avg: "$normalized_score" } // Calculate average of normalized_score
//           }
//         }
//       ]);

//        if (avgScoreResult.length > 0 && avgScoreResult[0].averageScore !== null) {
//         averageScore = parseFloat(avgScoreResult[0].averageScore.toFixed(2));
//       }

//     // Fetch latest test result for percentile and normalized score
//       latestTestResult = await Result.findOne({ user_id: new mongoose.Types.ObjectId(userId) })
//       .sort({ test_date: -1 }) // Get the most recent test
//       .select('normalized_score percentile_rank test_date feedback') // Select only relevant fields
//       .lean(); // Use .lean() for performance


//       console.log("DEBUG: latestTestResult fetched:", latestTestResult);

    
//       if (latestTestResult && latestTestResult.test_date) {
//         lastTestDate = new Date(latestTestResult.test_date).toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'long',
//           day: 'numeric'
//         });
//       }
//     }

//     const recentTests = await Result.find({ user_id: new mongoose.Types.ObjectId(userId) })
//       .sort({ test_date: -1 })
//       .limit(5) // Adjust limit as needed for your RecentTestsCard
//       .lean();



//     const leaderboardData = await Result.aggregate([
//       {
//         $group: {
//           _id: "$user_id",
//           averageNormalizedScore: { $avg: "$normalized_score" },
//           totalTestsTaken: { $sum: 1 }
//         }
//       },
//       {
//         $sort: {
//           averageNormalizedScore: -1
//         }
//       },
//       {
//         $limit: 5 // Top 10 users for the leaderboard
//       },
//       {
//         $lookup: {
//           from: 'users', // Collection name for users
//           localField: '_id',
//           foreignField: '_id',
//           as: 'userDetails'
//         }
//       },
//       {
//         $unwind: '$userDetails'
//       },
//       {
//         $project: {
//           _id: 0,
//           userId: '$_id',
//           username: '$userDetails.firstName',
//           averageNormalizedScore: { $round: ["$averageNormalizedScore", 2] },
//           totalTestsTaken: 1
//         }
//       }
//     ]);

//     //console.log("DEBUG: Raw leaderboardData from aggregation:", JSON.stringify(leaderboardData, null, 2));
//     console.log("DEBUG: Leaderboard data fetched:", leaderboardData.length, "entries.");




//     // Prepare general stats (you might have more complex stats here)
//     const stats = {
//       totalTests: totalTestsTaken,
//       averageScore: averageScore,
//       lastTestDate: lastTestDate,
//       latestTest: latestTestResult,
      
//     };


// console.log("DEBUG: Final stats object sent to frontend:", JSON.stringify(stats, null, 2));

//     res.status(200).json({
//       success: true,
//       user: user,
//       stats: {
//         ...stats,
//         latestTest: latestTestResult 
//       },
//       recentTests: recentTests,
//       leaderboard: leaderboardData 
//     });

//   } catch (error) {
//     console.error("Error fetching dashboard summary:", error);
//     res.status(500).json({ message: "Error fetching dashboard summary.", error: error.message });
//   }
// };


exports.getDashboardSummary = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    const userId = req.session.user._id;

    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Filter only full mock tests here:
    const fullTestFilter = { user_id: userId, type: "full" };

    const totalTestsTaken = await Result.countDocuments(fullTestFilter);

    let averageScore = 0;
    let lastTestDate = 'N/A';
    let latestTestResult = null;

    if (totalTestsTaken > 0) {
      // Average normalized score for full tests only
      const avgScoreResult = await Result.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(userId), type: "full" } },
        {
          $group: {
            _id: null,
            averageScore: { $avg: "$normalized_score" }
          }
        }
      ]);

      if (avgScoreResult.length > 0 && avgScoreResult[0].averageScore !== null) {
        averageScore = parseFloat(avgScoreResult[0].averageScore.toFixed(2));
      }

      // Latest full test result only
      latestTestResult = await Result.findOne({ user_id: userId, type: "full" })
        .sort({ test_date: -1 })
        .select('normalized_score percentile_rank test_date feedback')
        .lean();

      if (latestTestResult && latestTestResult.test_date) {
        lastTestDate = new Date(latestTestResult.test_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }

    // Recent full tests (limit 5)
    const recentTests = await Result.find(fullTestFilter)
      .sort({ test_date: -1 })
      .limit(5)
      .lean();

    // Leaderboard: average score and test count only on full tests
    const leaderboardData = await Result.aggregate([
      { $match: { type: "full" } },
      {
        $group: {
          _id: "$user_id",
          averageNormalizedScore: { $avg: "$normalized_score" },
          totalTestsTaken: { $sum: 1 }
        }
      },
      { $sort: { averageNormalizedScore: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          username: '$userDetails.firstName',
          averageNormalizedScore: { $round: ["$averageNormalizedScore", 2] },
          totalTestsTaken: 1
        }
      }
    ]);

    const stats = {
      totalTests: totalTestsTaken,
      averageScore: averageScore,
      lastTestDate: lastTestDate,
      latestTest: latestTestResult
    };

    res.status(200).json({
      success: true,
      user: user,
      stats,
      recentTests,
      leaderboard: leaderboardData
    });

  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ message: "Error fetching dashboard summary.", error: error.message });
  }
};



