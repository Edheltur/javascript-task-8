'use strict';

const ArgumentParser = require('argparse').ArgumentParser;
const commands = require('./commands');

module.exports.execute = execute;
module.exports.isStar = true;


let parseArgs = function () {
    const parser = new ArgumentParser({
        version: '0.0.1',
        addHelp: true,
        description: 'Useless chat client'
    });


    const subparsers = parser.addSubparsers({ title: 'commands', dest: 'cmd' });

    const list = subparsers.addParser('list', { addHelp: true });
    list.addArgument('--from', { help: 'Filter by sender name' });
    list.addArgument('--to', { help: 'Filter by receiver name' });

    const send = subparsers.addParser('send', { addHelp: true });
    send.addArgument('--from', { help: 'Sender name' });
    send.addArgument('--to', { help: 'Receiver name' });
    send.addArgument('--text', { help: 'Message text' });

    const del = subparsers.addParser('delete', { addHelp: true });
    del.addArgument('--id', { help: 'ID of deleting message' });

    const edit = subparsers.addParser('edit', { addHelp: true });
    edit.addArgument('--id', { help: 'ID of editing message' });
    edit.addArgument('--text', { help: 'New text text' });

    return parser.parseArgs();
};

function execute() {
    // Внутри этой функции нужно получить и обработать аргументы командной строки
    // const args = process.argv;
    const args = parseArgs();

    return commands.filter(x => x.canHandle(args))[0].handleAsync(args);
}
