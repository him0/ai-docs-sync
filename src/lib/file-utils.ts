import { existsSync, mkdirSync, copyFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import type { OutputPaths, RulePrefix } from '../constants';
import { DEFAULT_AI_DOCS_DIR, DEFAULT_RULES_DIR } from '../constants';
import type { LegacyFile } from './generators/types';

// File operation utilities
export const ensureDir = (dir: string): void => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
};

export const copyFileIfNotExists = (source: string, target: string): boolean => {
  if (!existsSync(target)) {
    ensureDir(dirname(target));
    copyFileSync(source, target);
    console.log(`📄 Copied file: ${target}`);
    return true;
  }
  console.log(`⚠️ File already exists (skipped): ${target}`);
  return false;
};

export const copyDirRecursive = (source: string, target: string): boolean => {
  if (!existsSync(source)) {
    console.error(`❌ Source directory does not exist: ${source}`);
    return false;
  }

  ensureDir(target);

  const entries = readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(source, entry.name);
    const destPath = join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileIfNotExists(srcPath, destPath);
    }
  }

  return true;
};

export const createFileWithContent = (filePath: string, content: string): void => {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, content);
    console.log(`📄 Created file: ${filePath}`);
  }
};

export const checkLegacyFiles = (legacyFiles: LegacyFile[]): void => {
  for (const { path, name } of legacyFiles) {
    if (existsSync(path)) {
      const stats = statSync(path);
      if (stats.isFile()) {
        console.error(`❌ Error: ${name} exists as a file but the new format uses directories.`);
        console.error(`   Please remove the existing ${name} file and try again.`);
        console.error(`   You can run: rm ${name}`);
        process.exit(1);
      }
    }
  }
};

// Path utilities
export const getAiDocsDir = (currentDir: string): string => {
  return join(currentDir, DEFAULT_AI_DOCS_DIR);
};

export const getRulesDir = (aiDocsDir: string): string => {
  return join(aiDocsDir, DEFAULT_RULES_DIR);
};

export const getOutputPaths = (outputRootDir: string): OutputPaths => {
  return {
    copilot: join(outputRootDir, '.github', 'copilot-instructions.md'),
    cline: join(outputRootDir, '.clinerules'),
    cursor: join(outputRootDir, '.cursor', 'rules')
  };
};

export const getIgnoreFilePath = (outputRootDir: string, prefix: RulePrefix): string => {
  switch (prefix) {
    case 'cursor':
      return join(outputRootDir, '.cursor', 'ignore');
    case 'cline':
      return join(outputRootDir, '.clineignore');
    default:
      return join(outputRootDir, `.${prefix}ignore`);
  }
};