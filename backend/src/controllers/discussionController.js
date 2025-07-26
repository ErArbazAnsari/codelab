const Discussion = require("../models/discussion")
const Problem = require("../models/problem")

const createDiscussion = async (req, res) => {
  try {
    const { problemId, title, content, tags } = req.body
    const userId = req.result._id

    // Verify problem exists
    const problem = await Problem.findById(problemId)
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    const discussion = await Discussion.create({
      problemId,
      userId,
      title,
      content,
      tags: tags || ["discussion"],
    })

    await discussion.populate("userId", "firstName lastName")
    res.status(201).json(discussion)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getDiscussions = async (req, res) => {
  try {
    const { problemId } = req.params
    const { page = 1, limit = 10, sortBy = "createdAt" } = req.query

    const discussions = await Discussion.find({ problemId })
      .populate("userId", "firstName lastName")
      .populate("replies.userId", "firstName lastName")
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Discussion.countDocuments({ problemId })

    res.json({
      discussions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const addReply = async (req, res) => {
  try {
    const { discussionId } = req.params
    const { content } = req.body
    const userId = req.result._id

    const discussion = await Discussion.findById(discussionId)
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" })
    }

    discussion.replies.push({
      userId,
      content,
      upvotes: [],
      createdAt: new Date(),
    })

    await discussion.save()
    await discussion.populate("replies.userId", "firstName lastName")

    res.json(discussion)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const voteDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params
    const { voteType } = req.body // 'upvote' or 'downvote'
    const userId = req.result._id

    const discussion = await Discussion.findById(discussionId)
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" })
    }

    // Remove existing votes
    discussion.upvotes = discussion.upvotes.filter((id) => !id.equals(userId))
    discussion.downvotes = discussion.downvotes.filter((id) => !id.equals(userId))

    // Add new vote
    if (voteType === "upvote") {
      discussion.upvotes.push(userId)
    } else if (voteType === "downvote") {
      discussion.downvotes.push(userId)
    }

    await discussion.save()
    res.json({
      upvotes: discussion.upvotes.length,
      downvotes: discussion.downvotes.length,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = { createDiscussion, getDiscussions, addReply, voteDiscussion }
