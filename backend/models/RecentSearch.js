const mongoose = require('mongoose');

const recentSearchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    companyName: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

/* Keep only the latest 20 searches per user via a static helper */
recentSearchSchema.statics.addSearch = async function (userId, symbol, companyName) {
  /* Upsert: if the symbol already exists for this user, update its timestamp */
  await this.findOneAndUpdate(
    { userId, symbol },
    { userId, symbol, companyName },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  /* Trim to 20 entries — delete oldest beyond the limit */
  const count = await this.countDocuments({ userId });
  if (count > 20) {
    const oldest = await this.find({ userId })
      .sort({ updatedAt: 1 })
      .limit(count - 20)
      .select('_id');
    await this.deleteMany({ _id: { $in: oldest.map((d) => d._id) } });
  }
};

module.exports = mongoose.model('RecentSearch', recentSearchSchema);
