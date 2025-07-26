const mongoose = require("mongoose")
const { Schema } = mongoose

const contestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    problems: [
      {
        problemId: {
          type: Schema.Types.ObjectId,
          ref: "problem",
          required: true,
        },
        points: {
          type: Number,
          default: 100,
        },
      },
    ],
    participants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        score: {
          type: Number,
          default: 0,
        },
        rank: {
          type: Number,
        },
        submissions: [
          {
            problemId: {
              type: Schema.Types.ObjectId,
              ref: "problem",
            },
            submissionId: {
              type: Schema.Types.ObjectId,
              ref: "submission",
            },
            points: {
              type: Number,
              default: 0,
            },
            submittedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "live", "ended"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  },
)

const Contest = mongoose.model("contest", contestSchema)
module.exports = Contest
