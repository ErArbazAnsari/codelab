const express = require('express');
const { refreshToken } = require('../controllers/refreshToken');

const refreshRouter = express.Router();

refreshRouter.post('/refresh-token', refreshToken);

module.exports = refreshRouter;
