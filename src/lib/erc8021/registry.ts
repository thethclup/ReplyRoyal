import { ERC8021Config } from './types.ts';

/**
 * A client to interact with the ERC-8021 code registry.
 */
export class ERC8021Registry {
  private registeredCodes: Map<string, ERC8021Config> = new Map();

  register(appId: string, config: ERC8021Config): void {
    this.registeredCodes.set(appId, config);
  }

  getConfig(appId: string): ERC8021Config | undefined {
    return this.registeredCodes.get(appId);
  }

  isRegistered(appId: string): boolean {
    return this.registeredCodes.has(appId);
  }
}

export const globalRegistry = new ERC8021Registry();
