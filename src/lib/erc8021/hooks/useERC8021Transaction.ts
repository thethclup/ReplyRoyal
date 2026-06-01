import { useSendTransaction } from 'wagmi';
import { appendERC8021Suffix } from '../utils.ts';
import { ERC8021Config } from '../types.ts';
import { SendTransactionParameters } from 'wagmi/actions';

export function useERC8021Transaction(config?: ERC8021Config) {
  const { sendTransactionAsync, ...rest } = useSendTransaction();

  const sendWithAttribution = async (args: SendTransactionParameters) => {
    let data = args.data || '0x';
    // Append the ERC-8021 suffix to the transaction data automatically
    data = appendERC8021Suffix(data, config);

    return sendTransactionAsync({
      ...args,
      data,
    });
  };

  return {
    sendTransactionAsync: sendWithAttribution,
    ...rest,
  };
}
