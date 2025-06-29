import { existsSync } from 'fs';
import { DEFAULT_AI_DOCS_DIR } from '../constants';
import { getAiDocsDir } from '../lib/file-utils';
import { compileRules, compileIgnore } from '../lib/compiler';

export const sync = (args: string[]): void => {
  const currentDir = process.cwd();
  const aiDocsDir = getAiDocsDir(currentDir);
  const isPlan = args.includes('--plan');

  if (!existsSync(aiDocsDir)) {
    console.error(`❌ ${DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-docs init first.`);
    process.exit(1);
  }

  if (isPlan) {
    console.log('📋 Planning sync (preview mode)...');
  } else {
    console.log('🔄 Syncing rules...');
  }
  
  try {
    compileRules(aiDocsDir, currentDir, isPlan);
    compileIgnore(aiDocsDir, currentDir, isPlan);
    
    if (isPlan) {
      console.log('✅ Plan completed! Use "ai-docs sync" to apply changes.');
    } else {
      console.log('✅ Rules synced successfully!');
    }
  } catch (error) {
    console.error(`❌ Error ${isPlan ? 'planning' : 'syncing'} rules:`, error);
    process.exit(1);
  }
};