import { join } from 'path';
import type { Generator, GeneratedFile, LegacyFile, RuleFile } from './types';

const convertToMDC = (content: string, filename: string): string => {
  const baseName = filename.replace('.md', '');
  const frontMatter = `---
description: ${baseName}
globs:
alwaysApply: false
---

`;
  return frontMatter + content;
};

const generate = (ruleFiles: RuleFile[], outputRootDir: string): GeneratedFile[] => {
  const outputPath = getOutputPath(outputRootDir);
  const generatedFiles: GeneratedFile[] = [];
  
  ruleFiles.forEach(ruleFile => {
    if (ruleFile.content.trim() !== '') {
      const mdcFilename = ruleFile.filename.replace('.md', '.mdc');
      const mdcPath = join(outputPath, mdcFilename);
      const mdcContent = convertToMDC(ruleFile.content, ruleFile.filename);
      
      generatedFiles.push({
        path: mdcPath,
        content: mdcContent
      });
    }
  });
  
  return generatedFiles;
};



const getOutputPath = (outputRootDir: string): string => {
  return join(outputRootDir, '.cursor', 'rules');
};

const getIgnorePath = (outputRootDir: string): string => {
  return join(outputRootDir, '.cursor', 'ignore');
};

const generateIgnore = (ignoreContent: string, outputRootDir: string): GeneratedFile | null => {
  const ignorePath = getIgnorePath(outputRootDir);
  
  return {
    path: ignorePath,
    content: ignoreContent
  };
};

const getLegacyFiles = (outputRootDir: string): LegacyFile[] => {
  return [
    { path: join(outputRootDir, '.cursorrules'), name: '.cursorrules' },
    { path: join(outputRootDir, '.cursorignore'), name: '.cursorignore' }
  ];
};

export const cursorGenerator: Generator = {
  generate,
  generateIgnore,
  getOutputPath,
  getIgnorePath,
  getLegacyFiles
};