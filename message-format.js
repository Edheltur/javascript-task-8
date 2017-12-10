'use strict';

const os = require('os');
const chalk = require('chalk');

function buildFormatter(key, color) {
    return {
        canFormat: msg => msg.hasOwnProperty(key),
        format: msg => `${chalk.hex(color)(key.toUpperCase())}: ${msg[key]}`
    };
}

const messageFormatters = [
    buildFormatter('from', '#F00'),
    buildFormatter('to', '#F00'),
    buildFormatter('text', '#0F0')
];

function formatMessage(message) {
    return messageFormatters
        .filter(x => x.canFormat(message))
        .map(x => x.format(message))
        .join(os.EOL);
}

module.exports = { formatMessage };
