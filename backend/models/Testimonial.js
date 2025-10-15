const mongoose = require('mongoose');
const TestimonialSchema = new mongoose.Schema({
  name: String,
  role: String,
  company: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Testimonial', TestimonialSchema);
