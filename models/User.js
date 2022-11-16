const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, required: true, unique: true },
    profile: { type: String, required: true },
    myBeadworks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Beadwork' }],
    sharedBeadworks: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Beadwork' },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
