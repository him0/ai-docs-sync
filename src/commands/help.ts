import { DEFAULT_AI_DOCS_DIR, DEFAULT_RULES_DIR } from '../constants';

export const showHelp = (): void => {
  console.log(`
ai-doc-sync

Usage:
  npx ai-doc-sync [command]

Commands:
  (default)  - Sync rules from ${DEFAULT_AI_DOCS_DIR}/${DEFAULT_RULES_DIR} to output files
  init       - Initialize a new ${DEFAULT_AI_DOCS_DIR} project
  plan       - Preview changes without writing files
  help       - Show this help message

Examples:
  npx ai-doc-sync       # Sync rules (default behavior)
  npx ai-doc-sync plan  # Preview changes without writing
  npx ai-doc-sync init  # Initialize a new project
  `);
};