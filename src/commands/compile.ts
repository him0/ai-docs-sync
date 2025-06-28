import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { DEFAULT_AI_DOCS_DIR, RULE_PREFIXES } from '../constants';
import { getAiDocsDir, getIgnoreFilePath } from '../lib/file-utils';
import { generateRuleFiles } from '../lib/rule-generator';

export const compileRules = (): void => {
  const currentDir = process.cwd();
  const aiDocsDir = getAiDocsDir(currentDir);

  if (!existsSync(aiDocsDir)) {
    console.error(`❌ ${DEFAULT_AI_DOCS_DIR} directory not found. Please run ai-docs init first.`);
    process.exit(1);
  }

  console.log('🔄 Compiling rules...');
  try {
    generateRuleFiles(aiDocsDir, currentDir);

    const ignoreFilePath = join(aiDocsDir, 'ignore');
    if (existsSync(ignoreFilePath)) {
      const ignoreContent = readFileSync(ignoreFilePath, 'utf-8');

      RULE_PREFIXES.forEach(prefix => {
        const outputPath = getIgnoreFilePath(currentDir, prefix);

        if (prefix === 'cursor') {
          mkdirSync(dirname(outputPath), { recursive: true });
        }

        writeFileSync(outputPath, ignoreContent);
        console.log(`📄 Generated: ${outputPath}`);
      });
    }

    console.log('✅ Rules compiled successfully!');
  } catch (error) {
    console.error('❌ Error compiling rules:', error);
    process.exit(1);
  }
};