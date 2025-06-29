import type { RulePrefix } from '../../constants';
import type { Generator } from './types';
import { copilotGenerator } from './copilot-generator';
import { cursorGenerator } from './cursor-generator';
import { clineGenerator } from './cline-generator';

const generators: Record<RulePrefix, Generator> = {
  copilot: copilotGenerator,
  cursor: cursorGenerator,
  cline: clineGenerator
};

export const getGenerator = (prefix: RulePrefix): Generator => {
  const generator = generators[prefix];
  if (!generator) {
    throw new Error(`No generator found for prefix: ${prefix}`);
  }
  return generator;
};

export const getAllGenerators = (): Record<RulePrefix, Generator> => {
  return generators;
};

export const registerGenerator = (prefix: RulePrefix, generator: Generator): void => {
  generators[prefix] = generator;
};

export * from './types';