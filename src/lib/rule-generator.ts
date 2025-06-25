import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import type { RulePrefix, LegacyFile } from '../constants';
import { RULE_PREFIXES, DEFAULT_RULES_DIR } from '../constants';
import { getOutputPaths, checkLegacyFiles } from './file-utils';

export const filterContentByPrefix = (content: string, prefix: string): string => {
  const lines = content.split('\n');
  const result: string[] = [];
  let includeSection = true;
  let inSection = false;

  for (const line of lines) {
    if (line.startsWith('#')) {
      inSection = false;
      if (line.includes(`[${prefix}]`)) {
        includeSection = true;
        inSection = true;
        result.push(line.replace(`[${prefix}]`, '').trim());
      } else if (line.includes('[')) {
        includeSection = false;
      } else {
        includeSection = !inSection;
        result.push(line);
      }
    } else if (includeSection && line.trim() !== '') {
      result.push(line);
    }
  }

  return result.join('\n');
};

export const convertToMDC = (content: string, filename: string): string => {
  const baseName = filename.replace('.md', '');
  const frontMatter = `---
description: ${baseName}
globs:
alwaysApply: false
---

`;
  return frontMatter + content;
};

const loadRuleFiles = (rulesDir: string): string[] => {
  if (!existsSync(rulesDir)) {
    console.error(`❌ Rules directory not found: ${rulesDir}`);
    process.exit(1);
  }

  const ruleFiles = readdirSync(rulesDir)
    .filter(file => file.endsWith('.md'))
    .sort();

  if (ruleFiles.length === 0) {
    console.warn(`⚠️ No rule files found in ${rulesDir}`);
  }

  return ruleFiles;
};

const previewRules = (rulesDir: string, ruleFiles: string[]): void => {
  RULE_PREFIXES.forEach(prefix => {
    console.log(`\n=== ${prefix.toUpperCase()} PREVIEW ===\n`);

    if (prefix === 'cursor') {
      ruleFiles.forEach(file => {
        const content = readFileSync(join(rulesDir, file), 'utf-8');
        const filteredContent = filterContentByPrefix(content, prefix);
        if (filteredContent.trim() !== '') {
          console.log(`--- ${file.replace('.md', '.mdc')} ---`);
          console.log(convertToMDC(filteredContent, file));
          console.log('');
        }
      });
    } else if (prefix === 'cline') {
      ruleFiles.forEach(file => {
        const content = readFileSync(join(rulesDir, file), 'utf-8');
        const filteredContent = filterContentByPrefix(content, prefix);
        if (filteredContent.trim() !== '') {
          console.log(`--- ${file} ---`);
          console.log(filteredContent);
          console.log('');
        }
      });
    } else {
      const filteredContent = ruleFiles
        .map(file => {
          const content = readFileSync(join(rulesDir, file), 'utf-8');
          return filterContentByPrefix(content, prefix);
        })
        .filter(content => content.trim() !== '')
        .join('\n\n');
      console.log(filteredContent);
    }

    console.log('\n=== END PREVIEW ===\n');
  });
};

const generateCursorFiles = (rulesDir: string, ruleFiles: string[], outputPath: string): void => {
  ruleFiles.forEach(file => {
    const content = readFileSync(join(rulesDir, file), 'utf-8');
    const filteredContent = filterContentByPrefix(content, 'cursor');
    if (filteredContent.trim() !== '') {
      const mdcFilename = file.replace('.md', '.mdc');
      const mdcPath = join(outputPath, mdcFilename);
      const mdcContent = convertToMDC(filteredContent, file);
      writeFileSync(mdcPath, mdcContent);
      console.log(`📄 Generated: ${mdcPath}`);
    }
  });
};

const generateClineFiles = (rulesDir: string, ruleFiles: string[], outputPath: string): void => {
  ruleFiles.forEach(file => {
    const content = readFileSync(join(rulesDir, file), 'utf-8');
    const filteredContent = filterContentByPrefix(content, 'cline');
    if (filteredContent.trim() !== '') {
      const clineFilePath = join(outputPath, file);
      writeFileSync(clineFilePath, filteredContent + '\n');
      console.log(`📄 Generated: ${clineFilePath}`);
    }
  });
};

const generateMergedFile = (rulesDir: string, ruleFiles: string[], outputPath: string, prefix: string): void => {
  const filteredContent = ruleFiles
    .map(file => {
      const content = readFileSync(join(rulesDir, file), 'utf-8');
      return filterContentByPrefix(content, prefix);
    })
    .filter(content => content.trim() !== '')
    .join('\n\n');

  writeFileSync(outputPath, filteredContent + '\n');
  console.log(`📄 Generated: ${outputPath}`);
};

const generateOutputFiles = (rulesDir: string, ruleFiles: string[], outputPaths: any): void => {
  mkdirSync(dirname(outputPaths.copilot), { recursive: true });
  mkdirSync(outputPaths.cline, { recursive: true });
  mkdirSync(outputPaths.cursor, { recursive: true });

  RULE_PREFIXES.forEach(prefix => {
    switch (prefix) {
      case 'cursor':
        generateCursorFiles(rulesDir, ruleFiles, outputPaths.cursor);
        break;
      case 'cline':
        generateClineFiles(rulesDir, ruleFiles, outputPaths.cline);
        break;
      default:
        generateMergedFile(rulesDir, ruleFiles, outputPaths[prefix], prefix);
        break;
    }
  });
};

export const generateRuleFiles = (inputRootDir: string, outputRootDir: string, preview: boolean = false): void => {
  const rulesDir = join(inputRootDir, DEFAULT_RULES_DIR);
  const outputPaths = getOutputPaths(outputRootDir);
  
  const ruleFiles = loadRuleFiles(rulesDir);

  if (preview) {
    previewRules(rulesDir, ruleFiles);
  } else {
    const legacyFiles: LegacyFile[] = [
      { path: outputPaths.cline, name: '.clinerules' },
      { path: join(outputRootDir, '.cursorrules'), name: '.cursorrules' },
      { path: join(outputRootDir, '.cursorignore'), name: '.cursorignore' }
    ];

    checkLegacyFiles(legacyFiles);
    generateOutputFiles(rulesDir, ruleFiles, outputPaths);
    console.log('✨ Generated files successfully!');
  }

  if (outputRootDir !== '.') {
    console.log(`📁 Using output directory: ${outputRootDir}`);
  }
  if (inputRootDir !== `./ai-docs`) {
    console.log(`📁 Using input directory: ${inputRootDir}`);
  }
};