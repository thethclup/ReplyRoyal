import { toHex, isHex, concat } from 'viem';
import { ERC8021Schema, ERC8021Config } from './types.ts';
import { DEFAULT_ATTRIBUTION_CODE, DEFAULT_BUILDER_CODE } from './constants.ts';

/**
 * Generates the ERC-8021 suffix based on the provided configuration.
 * Schema 0 primarily encodes the attribution and builder code into hex.
 */
export function generateERC8021Suffix(config: ERC8021Config = {}): `0x${string}` {
  const schema = config.schema ?? 0;
  const attributionCode = config.attributionCode || DEFAULT_ATTRIBUTION_CODE;
  const builderCode = config.builderCode || DEFAULT_BUILDER_CODE;

  // Example implementation of schema 0 encoding
  // Format: [schema_byte][attribution_length][attribution_bytes][builder_length][builder_bytes]
  const schemaHex = toHex(schema, { size: 1 });
  const attributionBytes = new TextEncoder().encode(attributionCode);
  const builderBytes = new TextEncoder().encode(builderCode);

  const attributionHex = toHex(attributionBytes);
  const builderHex = toHex(builderBytes);

  return concat([
    schemaHex,
    toHex(attributionBytes.length, { size: 1 }),
    attributionHex,
    toHex(builderBytes.length, { size: 1 }),
    builderHex
  ]);
}

/**
 * Appends the ERC-8021 suffix to the given calldata.
 */
export function appendERC8021Suffix(calldata: `0x${string}`, config?: ERC8021Config): `0x${string}` {
  if (!isHex(calldata)) {
    throw new Error('Invalid calldata. Must be a hex string.');
  }
  const suffix = generateERC8021Suffix(config);
  return concat([calldata, suffix]);
}
