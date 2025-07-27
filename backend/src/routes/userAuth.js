const express = require('express');

const authRouter =  express.Router();
const {register, login,logout, adminRegister,deleteProfile} = require('../controllers/userAuthent')
const userMiddleware = require("../../middleware/userMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

// Register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware ,adminRegister);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
authRouter.get('/check', async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.status(200).json({ user: null });
        const payload = require('jsonwebtoken').verify(token, process.env.JWT_KEY);
        const user = await require('../models/user').findById(payload._id);
        if (!user) return res.status(200).json({ user: null });
        res.status(200).json({
            user: {
                firstName: user.firstName,
                emailId: user.emailId,
                _id: user._id,
                role: user.role,
            },
            message: "Valid User"
        });
    } catch (err) {
        res.status(200).json({ user: null });
    }
});

module.exports = authRouter;

// login
// logout
