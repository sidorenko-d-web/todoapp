// import { useState, useCallback } from 'react';
// import { useTonConnect } from './useTonConnect';
// import { useSendTransaction } from './useSendTransaction';
// import { useUsdtTransactions } from './useUsdtTransactions';
// import { useTransactionNotificationContext } from '../providers/TransactionNotificationProvider';

// interface PaymentResult {
//   success: boolean;
//   error?: string;
//   transactionHash?: string;
//   senderAddress?: string;
// }

// export const useUsdtPayment = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentTrxId, setCurrentTrxId] = useState('');
//   const [error, setError] = useState('');

//   const transactions = useUsdtTransactions()

//   const { walletAddress, connectWallet } = useTonConnect();
//   const { sendUSDT } = useSendTransaction();
//   const { startTransaction, failTransaction, completeTransaction } = useTransactionNotificationContext();

//   // Handle payment process
//   const processPayment = useCallback(async (
//     amount: number,
//     onSuccess: (result: PaymentResult) => Promise<void>,
//   ): Promise<void> => {
//     // First, show the transaction progress notification
//     startTransaction();
//     setIsLoading(true);
//     setError('');

//     // Connect wallet if not connected
//     if (!walletAddress) {
//       try {
//         const connected = await connectWallet();
//         if (!connected) {
//           setError('Wallet connection timed out');
//           failTransaction(() => processPayment(amount, onSuccess));
//           setIsLoading(false);
//           return;
//         }
//       } catch (error) {
//         console.error('Error connecting wallet:', error);
//         setError('Failed to connect wallet');
//         failTransaction(() => processPayment(amount, onSuccess));
//         setIsLoading(false);
//         return;
//       }
//     }

//     try {
//       console.log("Starting USDT transaction...");

//       // Send USDT transaction (with a small delay to ensure notification is visible)
//       setTimeout(async () => {
//         try {
//           const trxId = await sendUSDT(amount);

//           console.log("Transaction ID obtained:", trxId);
//           if (trxId) {
//             setCurrentTrxId(trxId);
//           } else {
//             console.error('Transaction ID is undefined');
//           }

//           // Check transaction status
//           if (trxId) {
//             checkTransactionStatus(trxId, onSuccess);
//           } else {
//             console.error('Transaction ID is undefined');
//             setIsLoading(false);
//           }
//         } catch (error) {
//           console.error('Error while sending USDT transaction', error);
//           failTransaction(() => processPayment(amount, onSuccess));
//           setIsLoading(false);
//         }
//       }, 500);
//     } catch (error) {
//       console.error('Error in transaction process:', error);
//       failTransaction(() => processPayment(amount, onSuccess));
//       setIsLoading(false);
//     }
//   }, [walletAddress, connectWallet, sendUSDT, startTransaction, failTransaction]);

//   // Function to check transaction status
//   const checkTransactionStatus = useCallback(async (
//     trxId: string,
//     onSuccess: (result: PaymentResult) => Promise<void>,
//   ) => {
//     try {
//       // Try to find transaction in existing list by checking specifically
//       const tx = transactions[0]

//       if (tx && tx.status === 'succeeded' && currentTrxId === tx.orderId) {
//         // Transaction is successful
//         completeTransaction();

//         // Call the success callback with transaction details
//         await onSuccess({
//           success: true,
//           transactionHash: tx.hash,
//           senderAddress: tx.fromAddress.toString({bounceable: false})
//         });

//         // Reset state
//         setCurrentTrxId('');
//         setIsLoading(false);
//         return;
//       }

//       // If not found or not successful, schedule another check
//       setTimeout(() => checkTransactionStatus(trxId, onSuccess), 3000);

//       // Refresh transactions list periodically
//     } catch (error) {
//       console.error('Error checking transaction status:', error);
//       failTransaction(() => processPayment(Number(0), onSuccess)); // Default to 0 amount on retry
//       setIsLoading(false);
//     }
//   }, [completeTransaction, failTransaction, processPayment]);

//   return {
//     processPayment,
//     isLoading,
//     error,
//     currentTrxId
//   };
// };

// export default useUsdtPayment;






import { useState, useCallback } from 'react';
import { useTonConnect } from './useTonConnect';
import { useSendTransaction } from './useSendTransaction';
import { useUsdtTransactions } from './useUsdtTransactions';
import { useTransactionNotificationContext } from '../providers/TransactionNotificationProvider';
import { MAINNET_USDT_MASTER_ADDRESS } from '../constants/addresses';

interface PaymentResult {
  success: boolean;
  error?: string;
  transactionHash?: string;
  senderAddress?: string;
}

export const useUsdtPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrxId, setCurrentTrxId] = useState('');
  const [error, setError] = useState('');

  const { walletAddress, connectWallet } = useTonConnect();
  const { sendUSDT } = useSendTransaction();
  const { checkTransaction, refreshTransactions } = useUsdtTransactions();
  const { startTransaction, failTransaction, completeTransaction, notEnoughFunds } =
    useTransactionNotificationContext();

  const getUserUSDTBalance = async () => {
    const res = await fetch(`https://tonapi.io/v2/accounts/${walletAddress}/jettons/${MAINNET_USDT_MASTER_ADDRESS}`, {
      headers: {
        Accept: 'application/json',
      },
      method: 'GET',
    });

    const data = await res.json();
    return data['balance'] ? Number(data['balance']) / 1e6 : 0;
  };

  // Handle payment process
  const processPayment = useCallback(
    async (amount: number, onSuccess: (result: PaymentResult) => Promise<void>): Promise<void> => {
      // Connect wallet if not connected
      if (!walletAddress) {
        try {
          const connected = await connectWallet();
          if (!connected) {
            setError('Wallet connection timed out');
            failTransaction(() => processPayment(amount, onSuccess));
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error connecting wallet:', error);
          setError('Failed to connect wallet');
          failTransaction(() => processPayment(amount, onSuccess));
          setIsLoading(false);
          return;
        }
      }

      if (amount > (await getUserUSDTBalance())) {
        notEnoughFunds();
        return;
      }

      startTransaction();
      setIsLoading(true);
      setError('');

      try {
        console.log('Starting USDT transaction...');

        // Send USDT transaction (with a small delay to ensure notification is visible)
        setTimeout(async () => {
          try {
            const trxId = await sendUSDT(amount);

            console.log('Transaction ID obtained:', trxId);
            setCurrentTrxId(trxId || '');

            // Check transaction status
            checkTransactionStatus(trxId || '', onSuccess);
          } catch (error) {
            console.error('Error while sending USDT transaction', error);
            failTransaction(() => processPayment(amount, onSuccess));
            setIsLoading(false);
          }
        }, 500);
      } catch (error) {
        console.error('Error in transaction process:', error);
        failTransaction(() => processPayment(amount, onSuccess));
        setIsLoading(false);
      }
    },
    [walletAddress, connectWallet, sendUSDT, startTransaction, failTransaction, checkTransaction],
  );

  // Function to check transaction status
  const checkTransactionStatus = useCallback(
    async (trxId: string, onSuccess: (result: PaymentResult) => Promise<void>) => {
      try {
        // Try to find transaction in existing list by checking specifically
        const tx = await checkTransaction(trxId);

        if (tx && tx.status === 'succeeded') {
          // Transaction is successful
          completeTransaction();

          // Call the success callback with transaction details
          await onSuccess({
            success: true,
            transactionHash: tx.hash,
            senderAddress: tx.fromAddress.toString({ bounceable: false }),
          });

          // Reset state
          setCurrentTrxId('');
          setIsLoading(false);
          return;
        }

        // If not found or not successful, schedule another check
        setTimeout(() => checkTransactionStatus(trxId, onSuccess), 3000);

        // Refresh transactions list periodically
      } catch (error) {
        console.error('Error checking transaction status:', error);
        failTransaction(() => processPayment(Number(0), onSuccess)); // Default to 0 amount on retry
        setIsLoading(false);
      }
    },
    [checkTransaction, completeTransaction, failTransaction, processPayment],
  );

  return {
    processPayment,
    getUserUSDTBalance,
    isLoading,
    error,
    currentTrxId,
  };
};

export default useUsdtPayment;