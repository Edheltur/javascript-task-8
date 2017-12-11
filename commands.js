'use strict';
const os = require('os');
const buildUrl = require('build-url');
const fetchJson = require('node-fetch-json');
const { formatMessage } = require('./message-format');

const apiUrl = 'http://localhost:8080/messages';

function buildCommand(commandName, argDefinitions, handleAsync) {
    return {
        canHandle: ({ cmd }) => cmd === commandName,
        configureArgParse: function (subparsers) {
            const parser = subparsers.addParser(commandName, { addHelp: true });
            Object.keys(argDefinitions).forEach(function (key) {
                const isFlag = key.length === 1;
                if (isFlag) {
                    parser.addArgument(`-${key}`,
                        { action: 'storeTrue', help: argDefinitions[key] });
                } else {
                    parser.addArgument(`--${key}`, { help: argDefinitions[key] });
                }
            });
        },
        handleAsync
    };
}

function buildApiUrlWithParams(args) {
    const params = ['from', 'to']
        .filter(x => Boolean(args[x]))
        .reduce((acc, key) => {
            acc[key] = encodeURIComponent(args[key]);

            return acc;
        }, {});

    return Object.keys(params).length !== 0
        ? buildUrl(apiUrl, { queryParams: params })
        : apiUrl;
}

const commands = [
    buildCommand('list',
        {
            from: 'Filter by sender name',
            to: 'Filter by receiver name',
            v: 'Verbose mode'
        },
        function (args) {
            return fetchJson(buildApiUrlWithParams(args), { method: 'GET' })
                .then(data => data
                    .map(msg => formatMessage(msg, args))
                    .join(os.EOL + os.EOL));
        }),

    buildCommand('send',
        {
            from: 'Sender name',
            to: 'Receiver name',
            text: 'Message text',
            v: 'Verbose mode'
        },
        function (args) {
            const options = { method: 'POST', body: { text: args.text } };

            return fetchJson(buildApiUrlWithParams(args), options)
                .then(msg => formatMessage(msg, args));
        }),

    buildCommand('delete',
        {
            id: 'ID of deleting message',
            v: 'Verbose mode'
        },
        function (args) {
            return fetchJson(`${apiUrl}/${args.id}`, { method: 'DELETE' })
                .then(data => {
                    return data.status === 'ok' ? 'DELETED' : 'ERROR';
                });
        }),

    buildCommand('edit',
        {
            id: 'ID of deleting message',
            text: 'New message text',
            v: 'Verbose mode'
        },
        function (args) {
            return fetchJson(`${apiUrl}/${args.id}`, { method: 'PATCH' })
                .then(msg => formatMessage(msg, args));
        })
];
module.exports = commands;
