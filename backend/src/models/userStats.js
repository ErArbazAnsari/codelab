const mongoose = require("mongoose")
const { Schema } = mongoose

const userStatsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    totalSolved: {
      type: Number,
      default: 0,
    },
    easySolved: {
      type: Number,
      default: 0,
    },
    mediumSolved: {
      type: Number,
      default: 0,
    },
    hardSolved: {
      type: Number,
      default: 0,
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    acceptanceRate: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    maxStreak: {
      type: Number,
      default: 0,
    },
    lastSolvedDate: {
      type: Date,
    },
    ranking: {
      type: Number,
      default: 0,
    },
    contestsParticipated: {
      type: Number,
      default: 0,
    },
    contestRating: {
      type: Number,
      default: 1200,
    },
    badges: [
      {
        name: String,
        description: String,
        earnedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    solvedByTopic: {
      array: { type: Number, default: 0 },
      linkedList: { type: Number, default: 0 },
      graph: { type: Number, default: 0 },
      dp: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
)

const UserStats = mongoose.model("userStats", userStatsSchema)
module.exports = UserStats
