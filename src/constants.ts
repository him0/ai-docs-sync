export type RulePrefix = 'copilot' | 'cline' | 'cursor';

export interface OutputPaths {
  copilot: string;
  cline: string;
  cursor: string;
}

export const RULE_PREFIXES: RulePrefix[] = ['copilot', 'cline', 'cursor'];
export const DEFAULT_AI_DOCS_DIR = 'ai-docs';
export const DEFAULT_RULES_DIR = 'rules';