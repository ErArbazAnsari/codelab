const mongoose = require("mongoose")
const { Schema } = mongoose

const discussionSchema = new Schema(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: 200,
    },
    content: {
      type: String,
      required: true,
      maxLength: 5000,
    },
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    replies: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxLength: 2000,
        },
        upvotes: [
          {
            type: Schema.Types.ObjectId,
            ref: "user",
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [
      {
        type: String,
        enum: ["question", "solution", "optimization", "bug", "discussion"],
      },
    ],
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const Discussion = mongoose.model("discussion", discussionSchema)
module.exports = Discussion
