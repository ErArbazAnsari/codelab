const express = require("express")
const statsRouter = express.Router()
const userMiddleware = require("../../middleware/userMiddleware")
const { getUserStats, getLeaderboard } = require("../controllers/userStatsController")

statsRouter.get("/my-stats", userMiddleware, getUserStats)
statsRouter.get("/leaderboard", getLeaderboard)

module.exports = statsRouter
