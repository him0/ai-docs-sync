import type { RulePrefix } from '../../constants';
import type { Generator } from './types';
export declare const getGenerator: (prefix: RulePrefix) => Generator;
export declare const getAllGenerators: () => Record<RulePrefix, Generator>;
export declare const registerGenerator: (prefix: RulePrefix, generator: Generator) => void;
export * from './types';
//# sourceMappingURL=index.d.ts.map