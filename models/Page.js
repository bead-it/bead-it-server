const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  active: { type: Boolean, required: true, default: true },
  domain: { type: String, required: true },
  url: { type: String, required: true },
  title: { type: String, required: true, default: 'No title' },
  keywords: [{ type: String }],
  refs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],
  backRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = mongoose.model('Page', pageSchema);
