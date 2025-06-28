#!/usr/bin/env node
import { initProject } from './commands/init';
import { compile } from './commands/compile';
import { previewRules } from './commands/preview';
import { showHelp } from './commands/help';

const command = process.argv[2];

switch (command) {
  case 'init':
    initProject();
    break;
  case 'compile':
    compile();
    break;
  case 'preview':
    previewRules();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    console.log('❓ Unknown command: ' + command);
    showHelp();
    process.exit(1);
}
