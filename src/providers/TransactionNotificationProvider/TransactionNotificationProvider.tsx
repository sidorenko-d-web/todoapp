// import { createContext, useContext, useState } from 'react';
// import { useTonConnect } from '../../hooks';
// import { TransactionNotification } from '../../components';

// type NotificationType = 'progress' | 'error' | 'new_item';

// interface TransactionNotificationContextType {
//   showNotification: (type: NotificationType, message: string, retryHandler?: () => void) => void;
//   hideNotification: () => void;
// }

// export const TransactionNotificationContext = createContext<TransactionNotificationContextType>({
//   showNotification: () => {},
//   hideNotification: () => {}
// });

// export const TransactionNotificationProvider = ({ children }: { children: React.ReactNode }) => {
//   const [notification, setNotification] = useState<{
//     visible: boolean;
//     type: NotificationType;
//     message: string;
//     retryHandler?: () => void;
//   }>({
//     visible: false,
//     type: 'progress',
//     message: ''
//   });
  
//   const [timeoutId, setTimeoutId] = useState<number | null>(null);
//   const { userAddress } = useTonConnect();

//   const showNotification = (
//     type: NotificationType,
//     message: string,
//     retryHandler?: () => void
//   ) => {
//     if (!userAddress) return;

//     if (timeoutId) {
//       clearTimeout(timeoutId);
//     }

//     setNotification({
//       visible: true,
//       type,
//       message,
//       retryHandler
//     });

//     if (type !== 'error') {
//       const timeout = type === 'new_item' ? 3000 : 60000;
//       const id = window.setTimeout(() => {
//         hideNotification();
//       }, timeout);
//       setTimeoutId(id);
//     }
//   };

//   const hideNotification = () => {
//     setNotification(prev => ({ ...prev, visible: false }));
//     if (timeoutId) {
//       clearTimeout(timeoutId);
//     }
//   };

//   return (
//     <TransactionNotificationContext.Provider value={{ showNotification, hideNotification }}>
//       {children}
//       {notification.visible && (
//         <TransactionNotification
//           type={notification.type}
//           message={notification.message}
//           onRetry={notification.retryHandler}
//         />
//       )}
//     </TransactionNotificationContext.Provider>
//   );
// };

// export const useTransactionNotificationContext = () => useContext(TransactionNotificationContext);









import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { useUsdtTransactions } from '../../hooks';
import { TransactionNotification } from '../../components/';
import { 
  completeTransaction, 
  failTransaction, 
  hideNotification 
} from '../../redux/slices';

export const TransactionNotificationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const dispatch = useDispatch();
  const { transactions, checkTransaction, refreshTransactions } = useUsdtTransactions();
  const { 
    isVisible, 
    type, 
    message, 
    currentTrxId, 
    retryFunction 
  } = useSelector((state: RootState) => state.transactionNotification);
  
  const [transactionCheckFailed, setTransactionCheckFailed] = useState(false);

  // Auto-hide success notification after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible && type === 'new_item') {
      timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, type, dispatch]);

  // Monitor transaction status from transactions list
  useEffect(() => {
    if (!currentTrxId || !isVisible || type !== 'progress') return;

    const foundTransaction = transactions.find(tx => tx.orderId === currentTrxId);
    if (foundTransaction) {
      if (foundTransaction.status === 'succeeded') {
        dispatch(completeTransaction({ message: 'Transaction completed successfully!' }));
        console.log("Transaction completed:", foundTransaction);
      } else if (foundTransaction.status === 'failed') {
        dispatch(failTransaction({}));
        console.log("Transaction failed:", foundTransaction);
      }
    }
  }, [transactions, currentTrxId, dispatch, isVisible, type]);

  // Directly check transaction status when not found in the transactions list
  useEffect(() => {
    if (!currentTrxId || !isVisible || type !== 'progress' || transactionCheckFailed) return;

    const checkInterval = setInterval(async () => {
      try {
        console.log("Directly checking transaction status for:", currentTrxId);
        const transaction = await checkTransaction(currentTrxId);
        
        if (transaction) {
          clearInterval(checkInterval);
          
          if (transaction.status === 'succeeded') {
            dispatch(completeTransaction({ message: 'Transaction completed successfully!' }));
            console.log("Transaction completed:", transaction);
          } else if (transaction.status === 'failed') {
            dispatch(failTransaction({}));
            console.log("Transaction failed:", transaction);
          }
        } else {
          // Manual refresh after check
          await refreshTransactions();
        }
      } catch (error) {
        console.error("Error checking transaction:", error);
        setTransactionCheckFailed(true);
        clearInterval(checkInterval);
      }
    }, 5000); // Check every 5 seconds

    // Clear the interval after 2 minutes if transaction is not found
    const timeoutId = setTimeout(() => {
      clearInterval(checkInterval);
      setTransactionCheckFailed(true);
    }, 2 * 60 * 1000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeoutId);
    };
  }, [currentTrxId, isVisible, type, checkTransaction, refreshTransactions, dispatch, transactionCheckFailed]);

  const handleRetry = () => {
    setTransactionCheckFailed(false); // Reset the check failed state
    if (retryFunction) {
      retryFunction();
    }
  };

  const handleClose = () => {
    dispatch(hideNotification());
  };

  return (
    <>
      {children}
      {isVisible && (
        // <div style={{ 
        //   position: 'fixed', 
        //   bottom: '20px', 
        //   left: '50%', 
        //   transform: 'translateX(-50%)',
        //   zIndex: 1000
        // }}>
          <TransactionNotification
            type={type}
            message={message}
            onClose={handleClose}
            onRetry={handleRetry}
          />
        // </div>
      )}
    </>
  );
};