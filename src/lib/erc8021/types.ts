export type ERC8021Schema = 0 | 1 | 2;

export interface ERC8021Config {
  schema?: ERC8021Schema;
  attributionCode?: string;
  builderCode?: string;
}

export type ValidationLevel = 'Basic' | 'Standard' | 'Strict';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
