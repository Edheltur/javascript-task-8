'use strict';

const express = require('express');
const messages = require('./routes/messages');
const { responseNotFoundAsJson } = require('./utils');
const app = express();

app.use(express.json());
app.use('/messages', messages);
app.use(function (req, res) {
    responseNotFoundAsJson(res);
});

module.exports = app;
