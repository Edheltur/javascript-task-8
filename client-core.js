'use strict';

const ArgumentParser = require('argparse').ArgumentParser;
const commands = require('./commands');

module.exports.execute = execute;
module.exports.isStar = true;

function execute() {
    const parser = new ArgumentParser({
        version: '0.0.1',
        addHelp: true,
        description: 'Useless chat client'
    });


    const subparsers = parser.addSubparsers({ title: 'commands', dest: 'cmd' });

    commands.forEach(x => x.configureArgParse(subparsers));

    const args = parser.parseArgs();

    return commands.find(x => x.canHandle(args)).handleAsync(args);


}
