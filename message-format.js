'use strict';

const os = require('os');
const chalk = require('chalk');

class DefaultFormatter {
    constructor(key, color) {
        this.key = key;
        this.color = color;
    }

    canFormat(msg) {
        return msg.hasOwnProperty(this.key);
    }

    format(msg) {
        return `${chalk.hex(this.color)(this.key.toUpperCase())}: ${msg[this.key]}`;
    }
}

class TextFormatter extends DefaultFormatter {
    format(msg) {
        const text = super.format(msg);
        const editMark = msg.edited ? chalk.hex('#777')('(edited)') : '';

        return text + editMark;
    }
}

class IdFormatter extends DefaultFormatter {
    canFormat(msg, args) {
        return super.canFormat(msg) && args.v;
    }
}

const messageFormatters = [
    new IdFormatter('id', '#ff0'),
    new DefaultFormatter('from', '#F00'),
    new DefaultFormatter('to', '#F00'),
    new TextFormatter('text', '#0F0')

];

function formatMessage(message, args) {
    return messageFormatters
        .filter(x => x.canFormat(message, args))
        .map(x => x.format(message))
        .join('\n');
}

module.exports = { formatMessage };
