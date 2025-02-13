import { createContext, useContext, useState } from 'react';
import { useTonConnect } from '../../hooks';
import { TransactionNotification } from '../../components';

type NotificationType = 'progress' | 'error' | 'new_item';

interface TransactionNotificationContextType {
  showNotification: (type: NotificationType, message: string, retryHandler?: () => void) => void;
  hideNotification: () => void;
}

export const TransactionNotificationContext = createContext<TransactionNotificationContextType>({
  showNotification: () => {},
  hideNotification: () => {}
});

export const TransactionNotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: NotificationType;
    message: string;
    retryHandler?: () => void;
  }>({
    visible: false,
    type: 'progress',
    message: ''
  });
  
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const { userAddress } = useTonConnect();

  const showNotification = (
    type: NotificationType,
    message: string,
    retryHandler?: () => void
  ) => {
    if (!userAddress) return;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setNotification({
      visible: true,
      type,
      message,
      retryHandler
    });

    if (type !== 'error') {
      const timeout = type === 'new_item' ? 3000 : 60000;
      const id = window.setTimeout(() => {
        hideNotification();
      }, timeout);
      setTimeoutId(id);
    }
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  return (
    <TransactionNotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification.visible && (
        <TransactionNotification
          type={notification.type}
          message={notification.message}
          onRetry={notification.retryHandler}
          onClose={hideNotification}
        />
      )}
    </TransactionNotificationContext.Provider>
  );
};

export const useTransactionNotificationContext = () => useContext(TransactionNotificationContext);