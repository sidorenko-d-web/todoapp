// // import { useTransactionNotificationContext } from '../providers/TransactionNotificationProvider/TransactionNotificationProvider';
// // import { useTranslation } from 'react-i18next';

// // export const useTransactionNotification = () => {
// //   const { showNotification, hideNotification } = useTransactionNotificationContext()
// //   const {t} = useTranslation("transaction");

// //   return {
// //     startTransaction: () => {
// //       showNotification('progress', t('t1'));
// //     },
// //     failTransaction: (retryHandler: () => void) => {
// //       showNotification('error', t('t2'), retryHandler);
// //     },
// //     completeTransaction: () => {
// //       hideNotification()
// //       showNotification('new_item', t('t3'));
// //     }
// //   };
// // };

// import { useState, useCallback, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useLocation } from 'react-router-dom';

// export const useTransactionNotification = () => {
//   const [notificationType, setNotificationType] = useState<'progress' | 'error' | 'new_item' | null>(null);
//   const [notificationMessage, setNotificationMessage] = useState<string>('');
//   const [retryCallback, setRetryCallback] = useState<(() => void) | null>(null);
//   const { t } = useTranslation('transaction');

//   // For debugging purposes
//   useEffect(() => {
//     console.log("Notification state changed:", {
//       type: notificationType,
//       message: notificationMessage
//     });
//   }, [notificationType, notificationMessage]);

//   // Start a transaction notification
//   const startTransaction = useCallback(() => {
//     setNotificationType('progress');
//     setNotificationMessage(t('t1') || 'Processing transaction...');

//     // auto hide after 1 minute
//     setTimeout(() => {
//       setNotificationType(null);
//     }, 30 * 1000);
//   }, [t]);

//   // Show transaction error
//   const failTransaction = useCallback((onRetry?: () => void) => {
//     setNotificationType('error');
//     setNotificationMessage(t('t2') || 'Transaction failed');

//     if (onRetry) {
//       setRetryCallback(() => onRetry);
//     }

//     // auto hide after 5 seconds
//     setTimeout(() => {
//       setNotificationType(null);
//     }, 5000);
//   }, [t]);

//   // Show transaction success
//   const completeTransaction = useCallback(() => {
//     setNotificationType('new_item');
//     setNotificationMessage(t('t3') || 'Transaction completed');

//     // Auto-hide success notification after 3 seconds
//     setTimeout(() => {
//       setNotificationType(null);
//     }, 3000);
//   }, [t]);

//   // Close notification
//   const closeNotification = useCallback(() => {
//     setNotificationType(null);
//   }, []);

//   // Retry callback
//   const handleRetry = useCallback(() => {
//     if (retryCallback) {
//       retryCallback();
//     }
//   }, [retryCallback]);

//   return {
//     notificationType,
//     notificationMessage,
//     startTransaction,
//     failTransaction,
//     completeTransaction,
//     closeNotification,
//     handleRetry
//   };
// };

// export default useTransactionNotification;

import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useTransactionNotification = () => {
  const [notificationType, setNotificationType] = useState<'progress' | 'error' | 'new_item' | "not_enough_funds" | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [retryCallback, setRetryCallback] = useState<(() => void) | null>(null);
  const { t } = useTranslation('transaction');

  // For debugging purposes
  useEffect(() => {
    console.log('Notification state changed:', {
      type: notificationType,
      message: notificationMessage,
    });
  }, [notificationType, notificationMessage]);

  // Start a transaction notification
  const startTransaction = useCallback(() => {
    setNotificationType('progress');
    setNotificationMessage(t('t1') || 'Processing transaction...');
  }, [t]);

  // Show transaction error
  const failTransaction = useCallback(
    (onRetry?: () => void) => {
      setNotificationType('error');
      setNotificationMessage(t('t2') || 'Transaction failed');

      if (onRetry) {
        setRetryCallback(() => onRetry);
      }
    },
    [t],
  );

  // Show transaction success
  const completeTransaction = useCallback(() => {
    setNotificationType('new_item');
    setNotificationMessage(t('t3') || 'Transaction completed');

    // Auto-hide success notification after 3 seconds
    setTimeout(() => {
      setNotificationType(null);
    }, 3000);
  }, [t]);

  // Not enough funds
  const notEnoughFunds = useCallback(() => {
    setNotificationType('not_enough_funds');

    // Auto-hide not enough funds notification after 3 seconds
    setTimeout(() => {
      setNotificationType(null);
    }, 3000);
  }, [])

  // Close notification
  const closeNotification = useCallback(() => {
    setNotificationType(null);
  }, []);

  // Retry callback
  const handleRetry = useCallback(() => {
    if (retryCallback) {
      retryCallback();
    }
  }, [retryCallback]);

  return {
    notificationType,
    notificationMessage,
    startTransaction,
    failTransaction,
    completeTransaction,
    notEnoughFunds,
    closeNotification,
    handleRetry,
  };
};


