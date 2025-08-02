const jwt = require('jsonwebtoken');
const User = require('../models/user');

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                error: {
                    message: "No refresh token provided"
                }
            });
        }

        // Verify refresh token
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY || process.env.JWT_KEY);
        const user = await User.findById(payload._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    message: "Invalid refresh token"
                }
            });
        }

        // Generate new access token
        const newToken = jwt.sign(
            { _id: user._id, emailId: user.emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );

        // Set new access token cookie
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        return res.json({
            success: true,
            message: "Token refreshed successfully"
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: {
                message: "Invalid refresh token"
            }
        });
    }
};

module.exports = { refreshToken };
