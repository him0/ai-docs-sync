"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showHelp = void 0;
const constants_1 = require("../constants");
const showHelp = () => {
    console.log(`
ai-rule-forge CLI

Usage:
  npx ai-rule-forge <command>

Commands:
  init     - Initialize a new ${constants_1.DEFAULT_AI_DOCS_DIR} project
  compile  - Compile rules from ${constants_1.DEFAULT_AI_DOCS_DIR}/${constants_1.DEFAULT_RULES_DIR} to output files and generate ignore files
  preview  - Preview rules without writing to output files
  help     - Show this help message
  `);
};
exports.showHelp = showHelp;
