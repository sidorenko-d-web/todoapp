import { useCallback, useEffect, useRef, useState } from 'react';
import { JettonMaster, TonClient, Transaction } from '@ton/ton';
import { Address } from '@ton/core';
import { isUUID } from '../helpers';
import { UsdtTransaction } from '../types';
import { AccountSubscriptionService } from '../services';
import { MAINNET_RECEIVER_ADDRESS, MAINNET_USDT_MASTER_ADDRESS, TESTNET_RECEIVER_ADDRESS, TESTNET_USDT_MASTER_ADDRESS } from '../constants/addresses';
import { useTonConnect } from '../hooks';
import { CHAIN } from '@tonconnect/ui-react';

function parseUsdtPayload(tx: Transaction): UsdtTransaction | undefined {

  try {
    if (tx.inMessage?.info.type !== 'internal' || tx.description.type !== 'generic' || tx.description.computePhase?.type !== 'vm') {
      return;
    }

    const slice = tx.inMessage.body.beginParse();
    const opcode = slice.loadUint(32);
    if (opcode !== 0x178d4519) { // jetton internal transfer
      return;
    }

    slice.loadUint(64);
    const jettonAmount = slice.loadCoins();
    const fromAddress = slice.loadAddress();
    slice.loadAddress();
    slice.loadCoins();
    const forwardPayload = slice.loadMaybeRef();
    if (!forwardPayload) {
      return;
    }

    const payloadSlice = forwardPayload.beginParse();

    const payloadOpcode = payloadSlice.loadUint(32);
    if (payloadOpcode !== 0) {
      return;
    }

    const comment = payloadSlice.loadStringTail();
    if (!isUUID(comment)) {
      return;
    }

    return {
      status: tx.description.computePhase.success ? 'succeeded' : 'failed',
      hash: tx.hash().toString('hex'),
      usdtAmount: jettonAmount,
      gasUsed: tx.totalFees.coins,
      orderId: comment,
      timestamp: tx.inMessage.info.createdAt,
      fromAddress,
    };
  } catch {
    return;
  }
}


export const useUsdtTransactions = (): UsdtTransaction[] => {
  const { walletAddress, tonClient, network } = useTonConnect();
  const [transactions, setTransactions] = useState<UsdtTransaction[]>([]);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const accountSubscriptionService = useRef<AccountSubscriptionService | null>(null);
  const effectRan = useRef(false); // double render in dev mode
  const jettonMasterAddress = network === CHAIN.TESTNET ? TESTNET_USDT_MASTER_ADDRESS : MAINNET_USDT_MASTER_ADDRESS;
  const receiverAddress = network === CHAIN.TESTNET ? TESTNET_RECEIVER_ADDRESS : MAINNET_RECEIVER_ADDRESS

  const launchSubscriptionService = useCallback(async (tonClient: TonClient, walletAddress: Address) => {
    if (!tonClient || !walletAddress) return;
    const jettonMaster = tonClient.open(JettonMaster.create(jettonMasterAddress));
    const address = await jettonMaster.getWalletAddress(receiverAddress);
    console.log(walletAddress?.toString());
    accountSubscriptionService.current = new AccountSubscriptionService(tonClient, address, (txs) => {
      const newUsdtTransactions = txs.map(parseUsdtPayload)
        .filter((tx): tx is UsdtTransaction => tx?.fromAddress.toString() === walletAddress?.toString());
      setTransactions((oldTxs) => [
        ...newUsdtTransactions,
        ...oldTxs,
      ]);
    });

    intervalId.current = accountSubscriptionService.current.start();
  }, []);

  useEffect(() => {
    if (effectRan.current || !walletAddress || !tonClient) return;
    launchSubscriptionService(tonClient, walletAddress).catch(null);

    return () => {
      effectRan.current = true;
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
    };
  }, [launchSubscriptionService, tonClient, walletAddress]);

  return transactions;
};
