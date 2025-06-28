import { existsSync } from 'fs';
import { DEFAULT_AI_DOCS_DIR } from '../constants';
import { getAiDocsDir } from '../lib/file-utils';
import { compileRules, compileIgnore } from '../lib/compiler';

export const compile = (): void => {
  const currentDir = process.cwd();
  const aiDocsDir = getAiDocsDir(currentDir);

  if (!existsSync(aiDocsDir)) {
    console.error(`❌ ${DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-docs init first.`);
    process.exit(1);
  }

  console.log('🔄 Compiling rules...');
  try {
    compileRules(aiDocsDir, currentDir);
    compileIgnore(aiDocsDir, currentDir);
    console.log('✅ Rules compiled successfully!');
  } catch (error) {
    console.error('❌ Error compiling rules:', error);
    process.exit(1);
  }
};
