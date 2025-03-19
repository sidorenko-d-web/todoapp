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









import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { useUsdtTransactions } from '../../hooks';
import { TransactionNotification } from '../../components';
import { 
  completeTransaction, 
  failTransaction, 
  hideNotification 
} from '../../redux';

export const TransactionNotificationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const dispatch = useDispatch();
  const usdtTransactions = useUsdtTransactions();
  const { 
    isVisible, 
    type, 
    message, 
    currentTrxId, 
    retryFunction 
  } = useSelector((state: RootState) => state.transactionNotification);

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

  // Monitor transaction status changes
  useEffect(() => {
    if (!currentTrxId) return;

    const latestTransaction = usdtTransactions.find(tx => tx.orderId === currentTrxId);
    if (!latestTransaction) return;

    if (latestTransaction.status === 'succeeded') {
      dispatch(completeTransaction({ message: 'Transaction completed successfully!' }));
    } else if (latestTransaction.status === 'failed') {
      dispatch(failTransaction({}));
    }
  }, [usdtTransactions, currentTrxId, dispatch]);

  const handleRetry = () => {
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
        <div style={{ 
          position: 'fixed', 
          bottom: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 1000
        }}>
          <TransactionNotification
            type={type}
            message={message}
            onClose={handleClose}
            onRetry={handleRetry}
          />
        </div>
      )}
    </>
  );
};  