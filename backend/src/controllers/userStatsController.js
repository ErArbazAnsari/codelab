const UserStats = require("../models/userStats")
const User = require("../models/user")
const Submission = require("../models/submission")
const Problem = require("../models/problem")

const updateUserStats = async (userId, problemId, isAccepted) => {
  try {
    let stats = await UserStats.findOne({ userId })
    if (!stats) {
      stats = await UserStats.create({ userId })
    }

    // Update total submissions
    stats.totalSubmissions += 1

    if (isAccepted) {
      const problem = await Problem.findById(problemId)

      // Check if this is first time solving this problem
      const user = await User.findById(userId)
      const alreadySolved = user.problemSolved.includes(problemId)

      if (!alreadySolved) {
        stats.totalSolved += 1

        // Update difficulty-wise count
        switch (problem.difficulty) {
          case "easy":
            stats.easySolved += 1
            break
          case "medium":
            stats.mediumSolved += 1
            break
          case "hard":
            stats.hardSolved += 1
            break
        }

        // Update topic-wise count
        if (stats.solvedByTopic[problem.tags] !== undefined) {
          stats.solvedByTopic[problem.tags] += 1
        }

        // Update streak
        const today = new Date()
        const lastSolved = stats.lastSolvedDate

        if (lastSolved) {
          const daysDiff = Math.floor((today - lastSolved) / (1000 * 60 * 60 * 24))
          if (daysDiff === 1) {
            stats.currentStreak += 1
          } else if (daysDiff > 1) {
            stats.currentStreak = 1
          }
        } else {
          stats.currentStreak = 1
        }

        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak)
        stats.lastSolvedDate = today
      }
    }

    // Calculate acceptance rate
    const acceptedSubmissions = await Submission.countDocuments({
      userId,
      status: "accepted",
    })
    stats.acceptanceRate = ((acceptedSubmissions / stats.totalSubmissions) * 100).toFixed(2)

    await stats.save()
    return stats
  } catch (error) {
    console.error("Error updating user stats:", error)
  }
}

const getUserStats = async (req, res) => {
  try {
    const userId = req.result._id

    let stats = await UserStats.findOne({ userId })
    if (!stats) {
      stats = await UserStats.create({ userId })
    }

    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

const getLeaderboard = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query

    const leaderboard = await UserStats.find()
      .populate("userId", "firstName lastName")
      .sort({ totalSolved: -1, acceptanceRate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    // Update rankings
    leaderboard.forEach((entry, index) => {
      entry.ranking = (page - 1) * limit + index + 1
    })

    res.json(leaderboard)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = { updateUserStats, getUserStats, getLeaderboard }
