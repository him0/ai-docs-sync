import { DEFAULT_AI_DOCS_DIR, DEFAULT_RULES_DIR } from '../constants';

export const showHelp = (): void => {
  console.log(`
ai-docs-sync

Usage:
  npx ai-docs-sync [command]

Commands:
  (default)  - Sync rules from ${DEFAULT_AI_DOCS_DIR}/${DEFAULT_RULES_DIR} to output files
  init       - Initialize a new ${DEFAULT_AI_DOCS_DIR} project
  plan       - Preview changes without writing files
  help       - Show this help message

Examples:
  npx ai-docs-sync       # Sync rules (default behavior)
  npx ai-docs-sync plan  # Preview changes without writing
  npx ai-docs-sync init  # Initialize a new project
  `);
};