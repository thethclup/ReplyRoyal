import { isHex, concat, stringToHex } from 'viem';
import { ERC8021Schema, ERC8021Config } from './types.ts';
import { DEFAULT_ATTRIBUTION_CODE, DEFAULT_BUILDER_CODE, SCHEMA_ID_0, ERC8021_MAGIC_BYTES } from './constants.ts';

/**
 * Generates the ERC-8021 suffix based on the provided configuration.
 * Schema 0 primarily encodes the attribution and builder code into hex.
 */
export function generateERC8021Suffix(config: ERC8021Config): string {
  const schemaHex = config.schema === 1 ? '01' : config.schema === 2 ? '02' : SCHEMA_ID_0;
  
  const codes: string[] = [];
  if (config.attributionCode) codes.push(config.attributionCode);
  if (config.builderCode) codes.push(config.builderCode);
  
  const codesString = codes.join(',');
  const codesHex = stringToHex(codesString);
  const byteLength = new TextEncoder().encode(codesString).length;
  const codesLengthHex = byteLength.toString(16).padStart(2, '0');

  return codesHex + codesLengthHex + schemaHex + ERC8021_MAGIC_BYTES;
}

/**
 * Appends the ERC-8021 suffix to the given calldata.
 */
export function appendERC8021Calldata(calldata: `0x${string}`, config?: ERC8021Config): `0x${string}` {
  if (!isHex(calldata)) {
    throw new Error('Invalid calldata. Must be a hex string.');
  }
  const suffix = generateERC8021Suffix(config || {});
  return concat([calldata, suffix as `0x${string}`]);
}
