import { ValidationLevel, ValidationResult, ERC8021Config } from './types.ts';
import { isHex } from 'viem';

/**
 * Validates the generated ERC-8021 suffix or configuration.
 */
export function validateERC8021(
  calldata: string,
  config: ERC8021Config,
  level: ValidationLevel = 'Standard'
): ValidationResult {
  const errors: string[] = [];

  if (level === 'Basic' || level === 'Standard' || level === 'Strict') {
    if (!isHex(calldata)) {
      errors.push('Calldata must be a valid hex string starting with 0x.');
    }
  }

  if (level === 'Standard' || level === 'Strict') {
    if (!config.builderCode || config.builderCode === '[BUILDER_CODE]') {
      errors.push('Builder code is missing or using placeholder.');
    }
    if (config.schema === undefined) {
      errors.push('Schema must be defined.');
    }
  }

  if (level === 'Strict') {
    if (!config.attributionCode || config.attributionCode === '[ATTRIBUTION_CODE]') {
      errors.push('Attribution code is strictly required.');
    }
    if (config.schema !== 0 && config.schema !== 1 && config.schema !== 2) {
      errors.push(`Unsupported schema version: ${config.schema}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
