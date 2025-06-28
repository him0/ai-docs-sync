import { DEFAULT_AI_DOCS_DIR, DEFAULT_RULES_DIR } from '../constants';

export const showHelp = (): void => {
  console.log(`
ai-docs-cli

Usage:
  npx ai-docs <command>

Commands:
  init     - Initialize a new ${DEFAULT_AI_DOCS_DIR} project
  compile  - Compile rules from ${DEFAULT_AI_DOCS_DIR}/${DEFAULT_RULES_DIR} to output files and generate ignore files
  preview  - Preview rules without writing to output files
  help     - Show this help message
  `);
};