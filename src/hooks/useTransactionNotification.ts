// import { MODALS } from '../constants';
// import { IShopItem } from '../redux';
// import { useTransactionNotificationContext } from '../providers/TransactionNotificationProvider/TransactionNotificationProvider';
// import { useModal } from './useModal';
// import { useTranslation } from 'react-i18next';
//
// export const useTransactionNotification = () => {
//   const { showNotification, hideNotification } = useTransactionNotificationContext();
//   const {t} = useTranslation('transaction')
//
//
//   return {
//     startTransaction: () => {
//       showNotification('progress', t('s1'));
//     },
//     failTransaction: () => {
//       showNotification('error', t('s2'));
//     },
//     completeTransaction: (item: IShopItem) => {
//       hideNotification();
//       // openModal(MODALS.NEW_ITEM, { item, mode: 'item' });
//     }
//   };
// };

import { useTransactionNotificationContext } from '../providers/TransactionNotificationProvider/TransactionNotificationProvider';
import { useTranslation } from 'react-i18next';

export const useTransactionNotification = () => {
  const { showNotification, hideNotification } = useTransactionNotificationContext()
  const {t} = useTranslation("transaction");

  return {
    startTransaction: () => {
      showNotification('progress', t('t1'));
    },
    failTransaction: (retryHandler: () => void) => {
      showNotification('error', t('t2'), retryHandler);
    },
    completeTransaction: () => {
      hideNotification()
      showNotification('new_item', t('t3'));
    }
  };
};


