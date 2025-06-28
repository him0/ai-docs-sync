import { join } from 'path';
import type { Generator, GeneratedFile, LegacyFile, RuleFile } from './types';

const generate = (ruleFiles: RuleFile[], outputRootDir: string): GeneratedFile[] => {
  const outputPath = getOutputPath(outputRootDir);
  const mergedContent = ruleFiles
    .map(file => file.content)
    .filter(content => content.trim() !== '')
    .join('\n\n');

  const finalContent = mergedContent + '\n';

  return [{
    path: outputPath,
    content: finalContent
  }];
};

const getOutputPath = (outputRootDir: string): string => {
  return join(outputRootDir, '.github', 'copilot-instructions.md');
};

const getIgnorePath = (outputRootDir: string): string => {
  return join(outputRootDir, '.copilotignore');
};

const generateIgnore = (ignoreContent: string, outputRootDir: string): GeneratedFile | null => {
  const ignorePath = getIgnorePath(outputRootDir);
  
  return {
    path: ignorePath,
    content: ignoreContent
  };
};

const getLegacyFiles = (outputRootDir: string): LegacyFile[] => {
  return [];
};

export const copilotGenerator: Generator = {
  generate,
  generateIgnore,
  getOutputPath,
  getIgnorePath,
  getLegacyFiles
};