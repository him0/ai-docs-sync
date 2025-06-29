import { join } from 'path';
import { DEFAULT_AI_DOCS_DIR, DEFAULT_RULES_DIR } from '../constants';
import { ensureDir, copyDirRecursive, copyFileIfNotExists } from '../lib/file-utils';

export const initProject = (): void => {
  const currentDir = process.cwd();

  const aiDocsDir = join(currentDir, DEFAULT_AI_DOCS_DIR);
  const rulesDir = join(aiDocsDir, DEFAULT_RULES_DIR);

  ensureDir(aiDocsDir);
  ensureDir(rulesDir);

  const templatesDir = join(__dirname, '..', 'templates');
  const templateRulesDir = join(templatesDir, DEFAULT_RULES_DIR);
  const templateIgnoreFile = join(templatesDir, 'ignore');
  const targetIgnoreFile = join(aiDocsDir, 'ignore');

  if (require('fs').existsSync(templateRulesDir)) {
    console.log('📂 Copying rules templates...');
    copyDirRecursive(templateRulesDir, rulesDir);
  } else {
    console.warn('⚠️ Template rules directory not found:', templateRulesDir);
  }

  if (require('fs').existsSync(templateIgnoreFile)) {
    copyFileIfNotExists(templateIgnoreFile, targetIgnoreFile);
  } else {
    console.warn('⚠️ Template ignore file not found, creating default');
    const { createFileWithContent } = require('../lib/file-utils');
    createFileWithContent(targetIgnoreFile, '# Ignore patterns for AI assistants\n');
  }

  console.log(`✅ ${DEFAULT_AI_DOCS_DIR} project initialization complete!`);
  console.log('Next steps:');
  console.log(`1. Edit rules: modify files in the ${DEFAULT_AI_DOCS_DIR}/${DEFAULT_RULES_DIR}/ directory`);
  console.log(`2. Edit ignore patterns: modify the ${DEFAULT_AI_DOCS_DIR}/ignore file`);
  console.log('3. Sync: ai-docs-sync');
  console.log('4. Preview: ai-docs-sync plan');
};