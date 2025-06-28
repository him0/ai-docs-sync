import { existsSync } from 'fs';
import { DEFAULT_AI_DOCS_DIR } from '../constants';
import { getAiDocsDir } from '../lib/file-utils';
import { generateRuleFiles } from '../lib/rule-generator';

export const previewRules = (): void => {
  const currentDir = process.cwd();
  const aiDocsDir = getAiDocsDir(currentDir);

  if (!existsSync(aiDocsDir)) {
    console.error(`❌ ${DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-docs init first.`);
    process.exit(1);
  }

  console.log('🔍 Previewing rules...');
  try {
    generateRuleFiles(aiDocsDir, currentDir, true);
    console.log('✅ Rules preview completed!');
  } catch (error) {
    console.error('❌ Error previewing rules:', error);
    process.exit(1);
  }
};