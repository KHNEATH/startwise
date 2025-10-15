const mongoose = require('mongoose');
const MediaSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  date: Date,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Media', MediaSchema);
