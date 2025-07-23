const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to the 'User' model
    required: true
  },

   subject: {
        type: String,
        required: false 
    },

  test_date: {
    type: Date,
    default: Date.now
  },

   type: {
    type: String,
    enum: ["full", "subject"],
    default: "full"
   },
  time_taken: {
    type: Number,
    required: false 
},
  total_questions: Number,
  attempted: Number,
  correct: Number,
  subject_wise: {
    Physics: {
      attempted: { type: Number, default: 0 },
      correct: { type: Number, default: 0 }
    },
    Chemistry: {
      attempted: { type: Number, default: 0 },
      correct: { type: Number, default: 0 }
    },
    Math: {
      attempted: { type: Number, default: 0 },
      correct: { type: Number, default: 0 }
    },
    English: {
      attempted: { type: Number, default: 0 },
      correct: { type: Number, default: 0 }
    },
    Computer: {
      attempted: { type: Number, default: 0 },
      correct: { type: Number, default: 0 }
    }
  },
  difficulty_performance: {
    Basic: {
      total: { type: Number, default: 0 },
      correct: { type: Number, default: 0 }
    },
    Intermediate: {
      total: { type: Number, default: 0 },
      correct: { type: Number, default: 0 }
    },
    Hard: {
      total: { type: Number, default: 0 },
      correct: { type: Number, default: 0 }
    }
  },

  per_subject_difficulty: {
    Physics: {
      Basic: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      Intermediate: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      Hard: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      }
    },
    Chemistry: {
      Basic: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      Intermediate: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      Hard: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      }
    },
    Math: {
      Basic: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      Intermediate: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      Hard: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      }
    },
    English: {
      Basic: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      Intermediate: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      Hard: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      }
    },
    Computer: {
      Basic: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      Intermediate: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      Hard: {
        correct: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      }
    }
  },

  normalized_score: {
  type: Number,
  default: 0 
},

  percentile_rank: {
    type: Number,
    default: 0,
  },

  feedback: [String] // Example: ["Improve Math", "Strong in English"]
});

module.exports = mongoose.model('Result', resultSchema);
