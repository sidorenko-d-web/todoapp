import { createContext, useContext, useState } from 'react';
import { NewItemModal, TransactionNotification } from '../../components';
import { useTonConnect } from '../../hooks';

type NotificationType = 'progress' | 'error';

const TransactionNotificationContext = createContext({
    showNotification: (type: NotificationType, message: string) => {},
    hideNotification: () => {},
});

export const TransactionNotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState({
    visible: false,
    type: 'progress',
    message: '',
  });
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const {userAddress} = useTonConnect();

  const showNotification = (type: 'progress' | 'error', message: string) => {
    if (!userAddress) return

    if (timeoutId) clearTimeout(timeoutId);
    
    setNotification({
      visible: true,
      type,
      message,
    });

    const id = setTimeout(() => {
      hideNotification();
    }, 60000);
    setTimeoutId(id);
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
    if (timeoutId) clearTimeout(timeoutId);
  };

  return (
    <TransactionNotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification.visible && (
        <TransactionNotification 
          type={notification.type} 
          message={notification.message} 
          onClose={hideNotification}
        />
      )}
      <NewItemModal />
    </TransactionNotificationContext.Provider>
  );
};


export const useTransactionNotificationContext = () =>
    useContext(TransactionNotificationContext);