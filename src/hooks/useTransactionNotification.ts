import { MODALS } from '../constants';
import { IShopItem } from '../redux';
import { useTransactionNotificationContext } from '../providers/TransactionNotificationProvider/TransactionNotificationProvider';
import { useModal } from './useModal';

export const useTransactionNotification = () => {
  const { showNotification, hideNotification } = useTransactionNotificationContext();
  const { openModal } = useModal();

  return {
    startTransaction: () => {
      showNotification('progress', 'Обработка транзакции...');
    },
    failTransaction: () => {
      showNotification('error', 'Ошибка транзакции!');
    },
    completeTransaction: (item: IShopItem) => {
      hideNotification();
      openModal(MODALS.NEW_ITEM, { item, mode: 'item' });
    }
  };
};