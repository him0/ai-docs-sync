import { join } from 'path';
import { DEFAULT_AI_DOCS_DIR, DEFAULT_RULES_DIR } from '../constants';
import { ensureDir, copyDirRecursive, createFileWithContent } from '../lib/file-utils';

export const initProject = (): void => {
  const currentDir = process.cwd();

  const aiDocsDir = join(currentDir, DEFAULT_AI_DOCS_DIR);
  const rulesDir = join(aiDocsDir, DEFAULT_RULES_DIR);

  ensureDir(aiDocsDir);
  ensureDir(rulesDir);

  const ignoreFilePath = join(aiDocsDir, 'ignore');
  createFileWithContent(ignoreFilePath, '# Ignore patterns for AI assistants\n');

  const templatesDir = join(__dirname, '..', '..', 'src', 'templates');
  const templateRulesDir = join(templatesDir, DEFAULT_RULES_DIR);

  if (require('fs').existsSync(templateRulesDir)) {
    console.log('📂 Copying rules templates...');
    copyDirRecursive(templateRulesDir, rulesDir);
  } else {
    console.warn('⚠️ Template rules directory not found:', templateRulesDir);
  }

  console.log(`✅ ${DEFAULT_AI_DOCS_DIR} project initialization complete!`);
  console.log('Next steps:');
  console.log(`1. Edit rules: modify files in the ${DEFAULT_AI_DOCS_DIR}/${DEFAULT_RULES_DIR}/ directory`);
  console.log(`2. Edit ignore patterns: modify the ${DEFAULT_AI_DOCS_DIR}/ignore file`);
  console.log('3. Compile: npx ai-rule-forge compile');
  console.log('4. Preview: npx ai-rule-forge preview');
};