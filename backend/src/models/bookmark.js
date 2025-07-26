const mongoose = require("mongoose")
const { Schema } = mongoose

const bookmarkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure unique bookmarks per user-problem pair
bookmarkSchema.index({ userId: 1, problemId: 1 }, { unique: true })

const Bookmark = mongoose.model("bookmark", bookmarkSchema)
module.exports = Bookmark
