import { DEFAULT_AI_DOCS_DIR, DEFAULT_RULES_DIR } from '../constants';

export const showHelp = (): void => {
  console.log(`
ai-docs-sync

Usage:
  npx @him0/ai-docs-sync@latest [command]

Commands:
  (default)  - Sync rules from ${DEFAULT_AI_DOCS_DIR}/${DEFAULT_RULES_DIR} to output files
  init       - Initialize a new ${DEFAULT_AI_DOCS_DIR} project
  plan       - Preview changes without writing files
  help       - Show this help message

Examples:
  npx @him0/ai-docs-sync@latest       # Sync rules (default behavior)
  npx @him0/ai-docs-sync@latest plan  # Preview changes without writing
  npx @him0/ai-docs-sync@latest init  # Initialize a new project
  `);
};