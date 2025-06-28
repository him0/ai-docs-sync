import { join } from 'path';
import type { Generator, GeneratedFile, LegacyFile, RuleFile } from './types';

const generate = (ruleFiles: RuleFile[], outputRootDir: string): GeneratedFile[] => {
  const outputPath = getOutputPath(outputRootDir);
  const generatedFiles: GeneratedFile[] = [];
  
  ruleFiles.forEach(ruleFile => {
    if (ruleFile.content.trim() !== '') {
      const clineFilePath = join(outputPath, ruleFile.filename);
      const finalContent = ruleFile.content + '\n';
      
      generatedFiles.push({
        path: clineFilePath,
        content: finalContent
      });
    }
  });
  
  return generatedFiles;
};



const getOutputPath = (outputRootDir: string): string => {
  return join(outputRootDir, '.clinerules');
};

const getIgnorePath = (outputRootDir: string): string => {
  return join(outputRootDir, '.clineignore');
};

const generateIgnore = (ignoreContent: string, outputRootDir: string): GeneratedFile | null => {
  const ignorePath = getIgnorePath(outputRootDir);
  
  return {
    path: ignorePath,
    content: ignoreContent
  };
};

const getLegacyFiles = (outputRootDir: string): LegacyFile[] => {
  const outputPath = getOutputPath(outputRootDir);
  return [
    { path: outputPath, name: '.clinerules' }
  ];
};

export const clineGenerator: Generator = {
  generate,
  generateIgnore,
  getOutputPath,
  getIgnorePath,
  getLegacyFiles
};