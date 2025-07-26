const express = require("express")
const discussionRouter = express.Router()
const userMiddleware = require("../../middleware/userMiddleware")
const { createDiscussion, getDiscussions, addReply, voteDiscussion } = require("../controllers/discussionController")

discussionRouter.post("/create", userMiddleware, createDiscussion)
discussionRouter.get("/problem/:problemId", getDiscussions)
discussionRouter.post("/:discussionId/reply", userMiddleware, addReply)
discussionRouter.post("/:discussionId/vote", userMiddleware, voteDiscussion)

module.exports = discussionRouter
