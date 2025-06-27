// check-search-logs.js
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname'; // <-- Change to your DB name if needed

const searchLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userType: String,
  searchTerm: String,
  device: String,
  timestamp: { type: Date, default: Date.now }
});

const SearchLog = mongoose.model('SearchLog', searchLogSchema);

async function main() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    const logs = await SearchLog.find().sort({ timestamp: -1 }).limit(10).lean();
    if (logs.length === 0) {
      console.log('No search logs found.');
    } else {
      console.log('Latest 10 search logs:');
      logs.forEach((log, i) => {
        console.log(`${i + 1}.`, log);
      });
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main(); 