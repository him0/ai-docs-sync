#!/usr/bin/env node
import { initProject } from './commands/init';
import { sync } from './commands/sync';
import { showHelp } from './commands/help';

const command = process.argv[2];

switch (command) {
  case 'init':
    initProject();
    break;
  case 'plan':
    sync(['--plan']);
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  case undefined:
    // No subcommand provided, run sync by default
    sync([]);
    break;
  default:
    console.log('❓ Unknown command: ' + command);
    showHelp();
    process.exit(1);
}
