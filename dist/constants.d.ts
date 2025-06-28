export type RulePrefix = 'copilot' | 'cline' | 'cursor';
export interface OutputPaths {
    copilot: string;
    cline: string;
    cursor: string;
}
export interface LegacyFile {
    path: string;
    name: string;
}
export declare const RULE_PREFIXES: RulePrefix[];
export declare const DEFAULT_AI_DOCS_DIR = "ai-docs";
export declare const DEFAULT_RULES_DIR = "_rules";
//# sourceMappingURL=constants.d.ts.map