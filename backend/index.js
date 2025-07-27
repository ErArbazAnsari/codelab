const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const main = require("./src/config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/userAuth");
const redisClient = require("./src/config/redis");
const problemRouter = require("./src/routes/problemCreator");
const submitRouter = require("./src/routes/submit");
const aiRouter = require("./src/routes/aiChatting");
const videoRouter = require("./src/routes/videoCreator");
const bookmarkRouter = require("./src/routes/bookmarks");
const discussionRouter = require("./src/routes/discussions");
const statsRouter = require("./src/routes/stats");

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || process.env.PRODUCTION_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"]
}));
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// API routes
app.use("/api/user", authRouter);
app.use("/api/problem", problemRouter);
app.use("/api/submission", submitRouter);
app.use("/api/ai", aiRouter);
app.use("/api/video", videoRouter);
app.use("/api/bookmarks", bookmarkRouter);
app.use("/api/discussions", discussionRouter);
app.use("/api/stats", statsRouter);

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.originalUrl} not found`,
        },
    });
});

const InitalizeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("Database and Redis connected successfully");

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to initialize connections:", err);
        process.exit(1);
    }
};

// Graceful shutdown
process.on("SIGTERM", async () => {
    // logger.info('SIGTERM received, shutting down gracefully')
    await redisClient.disconnect();
    process.exit(0);
});

process.on("SIGINT", async () => {
    // logger.info('SIGINT received, shutting down gracefully')
    await redisClient.disconnect();
    process.exit(0);
});

InitalizeConnection();
