const mongoose = require('mongoose');

const beadworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: '' },
    description: { type: String, required: true, default: '' },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    beads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bead' }],
    threads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Beadwork', beadworkSchema);
