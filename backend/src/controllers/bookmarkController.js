const Bookmark = require("../models/bookmark")
const Problem = require("../models/problem")

const addBookmark = async (req, res) => {
  try {
    const { problemId } = req.body
    const userId = req.result._id

    // Check if problem exists
    const problem = await Problem.findById(problemId)
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({ userId, problemId })
    if (existingBookmark) {
      return res.status(400).json({ message: "Problem already bookmarked" })
    }

    const bookmark = await Bookmark.create({ userId, problemId })
    res.status(201).json({ message: "Problem bookmarked successfully", bookmark })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const removeBookmark = async (req, res) => {
  try {
    const { problemId } = req.params
    const userId = req.result._id

    const bookmark = await Bookmark.findOneAndDelete({ userId, problemId })
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" })
    }

    res.json({ message: "Bookmark removed successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.result._id

    const bookmarks = await Bookmark.find({ userId })
      .populate("problemId", "_id title difficulty tags")
      .sort({ createdAt: -1 })

    const problems = bookmarks.map((bookmark) => bookmark.problemId)
    res.json(problems)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = { addBookmark, removeBookmark, getUserBookmarks }
