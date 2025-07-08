const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Question = require('./model/questions');

const DB_PATH = "mongodb+srv://csit:csit@csit.lq452pz.mongodb.net/CSITDB?retryWrites=true&w=majority&appName=CSIT";
const files = ['physics.json', 'chemistry.json', 'math.json','english.json','computer.json'];

mongoose.connect(DB_PATH).then(async () => {
  console.log('Connected to Mongo ✅');

  try {
    for (const file of files) {
      const filePath = path.join(__dirname, 'data', file);
      const questions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const subject = file.replace('.json', '');
      const formattedSubject = subject.charAt(0).toUpperCase() + subject.slice(1);

      for (const q of questions) {
        q.subject = formattedSubject;

        await Question.updateOne(
          { question_id: q.question_id },
          { $set: q },
          { upsert: true } // Insert if not found
        );
      }

      console.log(`✅ Synced questions from ${file}`);
    }

    console.log("🎉 All subject questions synced without duplicates!");
  } catch (err) {
    console.error("❌ Error syncing questions:", err);
  } finally {
    mongoose.disconnect();
  }
});
