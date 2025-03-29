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




import React, { createContext, ReactNode } from 'react';
import {useTransactionNotification} from '../../hooks/useTransactionNotification';
import { TransactionNotification } from '../../components/TransactionNotification/TransactionNotification';
import { useLocation } from 'react-router-dom';

// Define the context type
type TransactionNotificationContextType = ReturnType<typeof useTransactionNotification>;

// Create the context with a default value
export const TransactionNotificationContext = createContext<TransactionNotificationContextType>({
  notificationType: null,
  notificationMessage: '',
  startTransaction: () => { },
  failTransaction: () => { },
  completeTransaction: () => { },
  notEnoughFunds: () => { },
  closeNotification: () => { },
  handleRetry: () => { }
});

// Provider component
interface TransactionNotificationProviderProps {
  children: ReactNode;
}

export const TransactionNotificationProvider: React.FC<TransactionNotificationProviderProps> = ({ children }) => {
  const notificationState = useTransactionNotification();
  const {
    notificationType,
    notificationMessage,
    closeNotification,
    handleRetry
  } = notificationState;

  const location = useLocation(); // Get the current location
  const allowedRoutes = ['/', '/shop', '/shop/inventory']; // Define routes where notifications should appear

  const shouldShowNotification = allowedRoutes.includes(location.pathname);

  // for main page lift notification up
  const styles: React.CSSProperties = location.pathname === '/' ? {
    position: 'fixed',
    top: 170,
    right: 0,
    left: 0,
    zIndex: 200
  } : {
    position: 'fixed',
    bottom: 110,
    right: 0,
    left: 0,
    zIndex: 200
  }

  return (
    <TransactionNotificationContext.Provider value={notificationState}>
      {children}

      {/* Render the TransactionNotification directly in the provider */}
      {notificationType && shouldShowNotification && (
        <div style={styles}>
          <TransactionNotification
            type={notificationType}
            message={notificationMessage}
            onClose={closeNotification}
            onRetry={handleRetry}
          />
        </div>
      )}
    </TransactionNotificationContext.Provider>
  );
};

// Optional: Create a hook for easy context access
export const useTransactionNotificationContext = () => {
  return React.useContext(TransactionNotificationContext);
};