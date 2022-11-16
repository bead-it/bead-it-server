const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema(
  {
    source: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Bead',
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Bead',
    },
    content: { type: String, default: '' },
    beadwork: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Beadwork',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Thread', threadSchema);
