const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true, ref: 'User' },
    content: { type: String, require: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Comment', commentSchema);
