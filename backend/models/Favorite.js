const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      trim: true,
      uppercase: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
