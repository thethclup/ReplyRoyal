import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { Attribution } from 'ox/erc8021';

// Use actual builder code (schema 2 app code + service code)
export const DATA_SUFFIX = Attribution.toDataSuffix({
  // You can include multiple codes here: e.g. ["bc_rarzcl2g", "another_code"]
  codes: ["bc_rarzcl2g"],
});

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Reply Royale' }),
    walletConnect({ projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID' }) // Provide fallback, set in production
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  dataSuffix: DATA_SUFFIX,
});
