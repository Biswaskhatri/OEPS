// controllers/dashboardController.js

const Test = require('../models/test'); 
const User = require('../models/user');

exports.getDashboard = async (req, res) => {
if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const userId = req.session.user._id;


  try {
    const userId = req.session.user._id;

    // 1. Fetch all tests of the current user
    const userTests = await result.find({ userId }).sort({ createdAt: -1 });

    const totalTests = userTests.length;

    // 2. Calculate average score
    const averageScore = totalTests > 0
      ? (userTests.reduce((sum, t) => sum + t.totalScore, 0) / totalTests).toFixed(2)
      : 0;

    // 3. Percentile rank (based on totalScore)
    const allTests = await Test.find();
    const lowerScoringUsers = allTests.filter(t => t.totalScore < (userTests[0]?.totalScore || 0)).length;
    const percentile = totalTests > 0 ? ((lowerScoringUsers / allTests.length) * 100).toFixed(2) : 0;

    // 4. Your Rank (1 is top)
    const sorted = allTests.sort((a, b) => b.totalScore - a.totalScore);
    const yourRank = sorted.findIndex(t => t.userId.toString() === userId.toString()) + 1;

    const stats = {
      totalTests,
      averageScore,
      percentile,
      yourRank
    };

    res.render('dashboard', {
      currentPage: 'dashboard',
      user: req.session.user,
      stats,
      recentTests: userTests.slice(0, 5) // last 5
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    res.status(500).send('Server Error');
  }
};
