export interface GeneratedFile {
    path: string;
    content: string;
}
export interface LegacyFile {
    path: string;
    name: string;
}
export interface RuleFile {
    filename: string;
    content: string;
}
export interface Generator {
    generate: (ruleFiles: RuleFile[], outputRootDir: string) => GeneratedFile[];
    generateIgnore: (ignoreContent: string, outputRootDir: string) => GeneratedFile | null;
    getOutputPath: (outputRootDir: string) => string;
    getIgnorePath: (outputRootDir: string) => string;
    getLegacyFiles: (outputRootDir: string) => LegacyFile[];
}
export interface GeneratorContext {
    rulesDir: string;
    ruleFiles: string[];
    outputRootDir: string;
    prefix: string;
}
//# sourceMappingURL=types.d.ts.map