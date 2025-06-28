import { existsSync, readdirSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { RULE_PREFIXES, DEFAULT_RULES_DIR } from '../constants';
import { checkLegacyFiles } from './file-utils';
import { getGenerator } from './generators';
import type { LegacyFile, RuleFile } from './generators/types';

const loadRuleFiles = (rulesDir: string): RuleFile[] => {
  if (!existsSync(rulesDir)) {
    console.error(`❌ Rules directory not found: ${rulesDir}`);
    process.exit(1);
  }

  const filenames = readdirSync(rulesDir)
    .filter(file => file.endsWith('.md'))
    .sort();

  if (filenames.length === 0) {
    console.warn(`⚠️ No rule files found in ${rulesDir}`);
  }

  return filenames.map(filename => ({
    filename,
    content: readFileSync(join(rulesDir, filename), 'utf-8')
  }));
};

const generateOutputFiles = (ruleFiles: RuleFile[], outputRootDir: string, dryRun: boolean = false): void => {
  RULE_PREFIXES.forEach(prefix => {
    const generator = getGenerator(prefix);
    const generatedFiles = generator.generate(ruleFiles, outputRootDir);

    if (dryRun) {
      console.log(`\n=== ${prefix.toUpperCase()} PREVIEW ===`);
      generatedFiles.forEach(file => {
        console.log(`\n--- ${file.path} ---`);
        console.log(file.content);
      });
      console.log(`\n=== END PREVIEW ===\n`);
    } else {
      generatedFiles.forEach(file => {
        mkdirSync(dirname(file.path), { recursive: true });
        writeFileSync(file.path, file.content);
        console.log(`📄 Generated: ${file.path}`);
      });
    }
  });
};

const generateIgnoreFiles = (inputRootDir: string, outputRootDir: string, dryRun: boolean = false): void => {
  const ignoreFilePath = join(inputRootDir, 'ignore');
  if (existsSync(ignoreFilePath)) {
    const ignoreContent = readFileSync(ignoreFilePath, 'utf-8');

    RULE_PREFIXES.forEach(prefix => {
      const generator = getGenerator(prefix);
      const generatedFile = generator.generateIgnore(ignoreContent, outputRootDir);

      if (generatedFile) {
        if (dryRun) {
          console.log(`\n=== ${prefix.toUpperCase()} IGNORE PREVIEW ===`);
          console.log(`\n--- ${generatedFile.path} ---`);
          console.log(generatedFile.content);
          console.log(`\n=== END PREVIEW ===\n`);
        } else {
          mkdirSync(dirname(generatedFile.path), { recursive: true });
          writeFileSync(generatedFile.path, generatedFile.content);
          console.log(`📄 Generated: ${generatedFile.path}`);
        }
      }
    });
  }
};

export const compileRules = (inputRootDir: string, outputRootDir: string, dryRun: boolean = false): void => {
  const rulesDir = join(inputRootDir, DEFAULT_RULES_DIR);
  const ruleFiles = loadRuleFiles(rulesDir);
  
  if (!dryRun) {
    const allLegacyFiles: LegacyFile[] = [];
    RULE_PREFIXES.forEach(prefix => {
      const generator = getGenerator(prefix);
      allLegacyFiles.push(...generator.getLegacyFiles(outputRootDir));
    });
    checkLegacyFiles(allLegacyFiles);
  }
  
  generateOutputFiles(ruleFiles, outputRootDir, dryRun);
};

export const compileIgnore = (inputRootDir: string, outputRootDir: string, dryRun: boolean = false): void => {
  generateIgnoreFiles(inputRootDir, outputRootDir, dryRun);
};

export const previewRules = (inputRootDir: string, outputRootDir: string): void => {
  compileRules(inputRootDir, outputRootDir, true);
  compileIgnore(inputRootDir, outputRootDir, true);
};

export const generateRuleFiles = (inputRootDir: string, outputRootDir: string, preview: boolean = false): void => {
  if (preview) {
    previewRules(inputRootDir, outputRootDir);
  } else {
    compileRules(inputRootDir, outputRootDir);
    compileIgnore(inputRootDir, outputRootDir);
    console.log('✨ Generated files successfully!');
  }

  if (outputRootDir !== '.') {
    console.log(`📁 Using output directory: ${outputRootDir}`);
  }
  if (inputRootDir !== `./ai-docs`) {
    console.log(`📁 Using input directory: ${inputRootDir}`);
  }
};