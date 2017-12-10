'use strict';
const os = require('os');
const buildUrl = require('build-url');
const fetchJson = require('node-fetch-json');
const chalk = require('chalk');
const { formatMessage } = require('./message-format');

const apiUrl = 'http://localhost:8080/messages';

function buildCommand(commandName, handler) {
    return {
        canHandle: ({ cmd }) => cmd === commandName,
        handleAsync: handler
    };
}

const commands = [
    buildCommand('list', function () {
        return fetchJson(apiUrl, { method: 'GET' })
            .then(data => data
                .map(formatMessage)
                .join(os.EOL + os.EOL));
    }),

    buildCommand('send', function (args) {
        const options = { method: 'POST', body: { text: args.text } };
        const params = ['from', 'to']
            .filter(x => Boolean(args[x]))
            .reduce((acc, key) => {
                acc[key] = args[key];

                return acc;
            }, {});

        const url = Object.keys(params).length !== 0
            ? buildUrl(apiUrl, { queryParams: params })
            : apiUrl;

        return fetchJson(url, options)
            .then(formatMessage);
    }),
    buildCommand('delete', function (args) {
        return fetchJson(`${apiUrl}/${args.id}`, { method: 'DELETE' })
            .then(data => {
                return data.status === 'ok' ? 'DELETED' : 'ERROR';
            });
    }),

    buildCommand('delete', function (args) {
        return fetchJson(`${apiUrl}/${args.id}`, { method: 'DELETE' })
            .then(data => {
                return data.status === 'ok' ? 'DELETED' : 'ERROR';
            });
    }),

    buildCommand('edit', function (args) {
        return fetchJson(`${apiUrl}/${args.id}`, { method: 'PATCH' })
            .then(data => {
                if (data.edited) {
                    data.text = data.text + chalk.gray('edited');
                }

                return formatMessage(data);
            });
    })

];

module.exports = commands;
