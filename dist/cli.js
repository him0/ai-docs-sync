#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("./commands/init");
const compile_1 = require("./commands/compile");
const preview_1 = require("./commands/preview");
const help_1 = require("./commands/help");
const command = process.argv[2];
switch (command) {
    case 'init':
        (0, init_1.initProject)();
        break;
    case 'compile':
        (0, compile_1.compileRules)();
        break;
    case 'preview':
        (0, preview_1.previewRules)();
        break;
    case 'help':
    case '--help':
    case '-h':
        (0, help_1.showHelp)();
        break;
    default:
        console.log('❓ Unknown command: ' + command);
        (0, help_1.showHelp)();
        process.exit(1);
}
