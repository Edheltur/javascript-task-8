'use strict';

const express = require('express');
const messages = require('./routes/messages');

const app = express();

app.use(express.json());
app.use('/messages', messages);


module.exports = app;
