const express = require('express');

const authRouter = require('../auth/auth-router.js');
const configureMiddleware = require('./configure-middleware.js');

const server = express();

configureMiddleware(server);

server.use('/api', authRouter);

module.exports = server;