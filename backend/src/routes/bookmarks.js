const express = require("express")
const bookmarkRouter = express.Router()
const userMiddleware = require("../../middleware/userMiddleware")
const { addBookmark, removeBookmark, getUserBookmarks } = require("../controllers/bookmarkController")

bookmarkRouter.post("/add", userMiddleware, addBookmark)
bookmarkRouter.delete("/remove/:problemId", userMiddleware, removeBookmark)
bookmarkRouter.get("/my-bookmarks", userMiddleware, getUserBookmarks)

module.exports = bookmarkRouter
