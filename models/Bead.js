const mongoose = require('mongoose');

const beadSchema = new mongoose.Schema(
  {
    page: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Page' },
    tags: [{ type: String }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    beadwork: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'Beadwork',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Bead', beadSchema);
