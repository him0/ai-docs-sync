import type { OutputPaths, RulePrefix } from '../constants';
import type { LegacyFile } from './generators/types';
export declare const ensureDir: (dir: string) => void;
export declare const copyFileIfNotExists: (source: string, target: string) => boolean;
export declare const copyDirRecursive: (source: string, target: string) => boolean;
export declare const createFileWithContent: (filePath: string, content: string) => void;
export declare const checkLegacyFiles: (legacyFiles: LegacyFile[]) => void;
export declare const getAiDocsDir: (currentDir: string) => string;
export declare const getRulesDir: (aiDocsDir: string) => string;
export declare const getOutputPaths: (outputRootDir: string) => OutputPaths;
export declare const getIgnoreFilePath: (outputRootDir: string, prefix: RulePrefix) => string;
//# sourceMappingURL=file-utils.d.ts.map