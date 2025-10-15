const mongoose = require('mongoose');
const AchievementSchema = new mongoose.Schema({
  title: String,
  value: String,
  icon: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Achievement', AchievementSchema);
