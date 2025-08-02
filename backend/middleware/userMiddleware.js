const jwt = require("jsonwebtoken");
const User = require("../src/models/user");
const redisClient = require("../src/config/redis");

const userMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Authentication required");
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_KEY);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                // Token expired, try to refresh using Redis refresh token
                const refreshToken = req.cookies.refreshToken;
                if (refreshToken) {
                    try {
                        const refreshPayload = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
                        const user = await User.findById(refreshPayload._id);
                        if (user) {
                            // Generate new access token
                            const newToken = jwt.sign(
                                { _id: user._id, emailId: user.emailId, role: user.role },
                                process.env.JWT_KEY,
                                { expiresIn: '1h' }
                            );
                            // Set new cookie
                            res.cookie('token', newToken, {
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 60 * 60 * 1000 // 1 hour
                            });
                            payload = jwt.verify(newToken, process.env.JWT_KEY);
                        }
                    } catch (refreshErr) {
                        throw new Error("Session expired. Please login again");
                    }
                } else {
                    throw new Error("Session expired. Please login again");
                }
            } else {
                throw new Error("Invalid token");
            }
        }

        const { _id } = payload;
        if (!_id) {
            throw new Error("Invalid token");
        }

        const result = await User.findById(_id);
        if (!result) {
            throw new Error("User not found");
        }

        // Check if token is blacklisted
        const IsBlocked = await redisClient.exists(`token:${token}`);
        if (IsBlocked) {
            throw new Error("Session invalidated");
        }

        req.result = result;
        next();
    }
    catch(err){
        res.status(401).json({
            success: false,
            error: {
                message: err.message || "Unauthorized"
            }
        });
    }

}


module.exports = userMiddleware;
