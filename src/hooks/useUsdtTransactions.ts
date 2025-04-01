// import { useCallback, useEffect, useRef, useState } from 'react';
// import { JettonMaster, TonClient, Transaction } from '@ton/ton';
// import { Address } from '@ton/core';
// import { isUUID } from '../helpers';
// import { UsdtTransaction } from '../types';
// import { AccountSubscriptionService } from '../services';
// import {
//   MAINNET_RECEIVER_ADDRESS,
//   MAINNET_USDT_MASTER_ADDRESS,
//   TESTNET_RECEIVER_ADDRESS,
//   TESTNET_USDT_MASTER_ADDRESS,
// } from '../constants/addresses';
// import { useTonConnect } from '../hooks';
// import { CHAIN } from '@tonconnect/ui-react';

// function parseUsdtPayload(tx: Transaction): UsdtTransaction | undefined {

//   try {
//     if (tx.inMessage?.info.type !== 'internal' || tx.description.type !== 'generic' || tx.description.computePhase?.type !== 'vm') {
//       return;
//     }

//     const slice = tx.inMessage.body.beginParse();
//     const opcode = slice.loadUint(32);
//     if (opcode !== 0x178d4519) { // jetton internal transfer
//       return;
//     }

//     slice.loadUint(64);
//     const jettonAmount = slice.loadCoins();
//     const fromAddress = slice.loadAddress();
//     slice.loadAddress();
//     slice.loadCoins();
//     const forwardPayload = slice.loadMaybeRef();
//     if (!forwardPayload) {
//       return;
//     }

//     const payloadSlice = forwardPayload.beginParse();

//     const payloadOpcode = payloadSlice.loadUint(32);
//     if (payloadOpcode !== 0) {
//       return;
//     }

//     const comment = payloadSlice.loadStringTail();
//     if (!isUUID(comment)) {
//       return;
//     }

//     return {
//       status: tx.description.computePhase.success ? 'succeeded' : 'failed',
//       hash: tx.hash().toString('hex'),
//       usdtAmount: jettonAmount,
//       gasUsed: tx.totalFees.coins,
//       orderId: comment,
//       timestamp: tx.inMessage.info.createdAt,
//       fromAddress,
//     };
//   } catch {
//     return;
//   }
// }


// export const useUsdtTransactions = (): UsdtTransaction[] => {
//   const { walletAddress, tonClient, network } = useTonConnect();
//   const [transactions, setTransactions] = useState<UsdtTransaction[]>([]);
//   const intervalId = useRef<NodeJS.Timeout | null>(null);
//   const accountSubscriptionService = useRef<AccountSubscriptionService | null>(null);
//   const effectRan = useRef(false); // double render in dev mode
//   const jettonMasterAddress = network === CHAIN.TESTNET ? TESTNET_USDT_MASTER_ADDRESS : MAINNET_USDT_MASTER_ADDRESS;
//   const receiverAddress = network === CHAIN.TESTNET ? TESTNET_RECEIVER_ADDRESS : MAINNET_RECEIVER_ADDRESS

//   const launchSubscriptionService = useCallback(async (tonClient: TonClient, walletAddress: Address) => {
//     if (!tonClient || !walletAddress) return;
//     const jettonMaster = tonClient.open(JettonMaster.create(jettonMasterAddress));
//     const address = await jettonMaster.getWalletAddress(receiverAddress);

//     accountSubscriptionService.current = new AccountSubscriptionService(tonClient, address, (txs) => {
//       const newUsdtTransactions = txs.map(parseUsdtPayload)
//         .filter((tx): tx is UsdtTransaction => tx?.fromAddress.toString() === walletAddress?.toString());
//       setTransactions((oldTxs) => [
//         ...newUsdtTransactions,
//         ...oldTxs,
//       ]);
//     });

//     intervalId.current = accountSubscriptionService.current.start();
//   }, []);

//   useEffect(() => {
//     if (effectRan.current || !walletAddress || !tonClient) return;
//     launchSubscriptionService(tonClient, walletAddress).catch(null);

//     return () => {
//       effectRan.current = true;
//       if (intervalId.current !== null) {
//         clearInterval(intervalId.current);
//       }
//     };
//   }, [launchSubscriptionService, tonClient, walletAddress]);

//   return transactions;
// };






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
  } catch (error) {
    console.error("Error parsing USDT payload:", error);
    return;
  }
}

// // Direct method to check a specific transaction
const checkSpecificTransaction = async (
  tonClient: TonClient,
  jettonMasterAddress: Address,
  receiverAddress: Address,
  orderId: string
): Promise<UsdtTransaction | undefined> => {
  try {
    if (!tonClient) return undefined;
    
    // Get the jetton wallet address for the receiver
    const jettonMaster = tonClient.open(JettonMaster.create(jettonMasterAddress));
    const jettonWalletAddress = await jettonMaster.getWalletAddress(receiverAddress);
    
    // Get recent transactions (increased limit to catch more transactions)
    const transactions = await tonClient.getTransactions(jettonWalletAddress, { limit: 20 });
    
    // Parse and filter transactions
    const usdtTransactions = transactions
      .map(parseUsdtPayload)
      .filter((tx): tx is UsdtTransaction => {
        // Check if transaction exists and matches our orderId
        return !!tx && tx.orderId === orderId;
      });
    
    return usdtTransactions[0]; // Return the first matching transaction if found
  } catch (error) {
    console.error("Error checking specific transaction:", error);
    return undefined;
  }
};

export const useUsdtTransactions = (): {
  transactions: UsdtTransaction[];
  checkTransaction: (orderId: string) => Promise<UsdtTransaction | undefined>;
  refreshTransactions: () => Promise<void>;
} => {
  const { walletAddress, tonClient, network } = useTonConnect();
  const [transactions, setTransactions] = useState<UsdtTransaction[]>([]);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const accountSubscriptionService = useRef<AccountSubscriptionService | null>(null);
  const effectRan = useRef(false); // double render in dev mode
  
  const jettonMasterAddress = network === CHAIN.TESTNET ? TESTNET_USDT_MASTER_ADDRESS : MAINNET_USDT_MASTER_ADDRESS;
  const receiverAddress = network === CHAIN.TESTNET ? TESTNET_RECEIVER_ADDRESS : MAINNET_RECEIVER_ADDRESS;

  // Direct method to check a transaction by orderId
  const checkTransaction = useCallback(
    async (orderId: string): Promise<UsdtTransaction | undefined> => {
      if (!tonClient || !walletAddress) return undefined;
      
      const transaction = await checkSpecificTransaction(
        tonClient,
        jettonMasterAddress,
        receiverAddress,
        orderId
      );
      
      if (transaction) {
        // Add to transactions list if not already there
        setTransactions(prevTxs => {
          const exists = prevTxs.some(tx => tx.hash === transaction.hash);
          if (!exists) {
            return [transaction, ...prevTxs];
          }
          return prevTxs;
        });
      }
      
      return transaction;
    },
    [tonClient, walletAddress, jettonMasterAddress, receiverAddress]
  );

  // Function to manually refresh transactions
  const refreshTransactions = useCallback(async () => {
    if (!tonClient || !walletAddress) return;
    
    try {
      const jettonMaster = tonClient.open(JettonMaster.create(jettonMasterAddress));
      const address = await jettonMaster.getWalletAddress(receiverAddress);
      
      // Get more recent transactions (increased limit from 100 to 20)
      const transactions = await tonClient.getTransactions(address, { limit: 20 });
      
      const newUsdtTransactions = transactions
        .map(parseUsdtPayload)
        .filter((tx): tx is UsdtTransaction => tx?.fromAddress.toString() === walletAddress?.toString());
      
      setTransactions(prevTxs => {
        // Merge and deduplicate transactions
        const allTxs = [...newUsdtTransactions, ...prevTxs];
        const uniqueTxs = allTxs.filter((tx, index, self) => 
          index === self.findIndex(t => t.hash === tx.hash)
        );
        return uniqueTxs;
      });
      
      console.log("Refreshed transactions:", newUsdtTransactions);
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    }
  }, [tonClient, walletAddress, jettonMasterAddress, receiverAddress]);

  const launchSubscriptionService = useCallback(async (tonClient: TonClient, walletAddress: Address) => {
    if (!tonClient || !walletAddress) return;
    
    try {
      const jettonMaster = tonClient.open(JettonMaster.create(jettonMasterAddress));
      const address = await jettonMaster.getWalletAddress(receiverAddress);
      
      console.log("Monitoring USDT wallet:", address.toString());
      
      accountSubscriptionService.current = new AccountSubscriptionService(tonClient, address, (txs) => {
        const newUsdtTransactions = txs
          .map(parseUsdtPayload)
          .filter((tx): tx is UsdtTransaction => tx?.fromAddress.toString() === walletAddress?.toString());
        
        if (newUsdtTransactions.length > 0) {
          console.log("New USDT transactions detected:", newUsdtTransactions);
        }
        
        setTransactions((oldTxs) => [
          ...newUsdtTransactions,
          ...oldTxs,
        ]);
      });

      intervalId.current = accountSubscriptionService.current.start();
      
      // Initial refresh
      refreshTransactions();
    } catch (error) {
      console.error("Error launching subscription service:", error);
    }
  }, [jettonMasterAddress, receiverAddress, refreshTransactions]);

  useEffect(() => {
    if (effectRan.current || !walletAddress || !tonClient) return;
    
    console.log("Initializing USDT transaction monitoring for wallet:", walletAddress.toString());
    launchSubscriptionService(tonClient, walletAddress).catch(error => {
      console.error("Failed to launch subscription service:", error);
    });

    // Set up an additional periodic refresh as a backup
    const refreshInterval = setInterval(refreshTransactions, 30000); // Every 30 seconds

    return () => {
      effectRan.current = true;
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
      clearInterval(refreshInterval);
    };
  }, [launchSubscriptionService, tonClient, walletAddress, refreshTransactions]);

  return { 
    transactions, 
    checkTransaction,
    refreshTransactions
  };
};