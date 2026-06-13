import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { Attribution } from 'ox/erc8021';

// Replace with actual builder code
const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_rarzcl2g"],
});

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Reply Royale' }),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' }) // Provide fallback
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  dataSuffix: DATA_SUFFIX,
});
