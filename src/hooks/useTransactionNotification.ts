// import { useTransactionNotificationContext } from '../providers/TransactionNotificationProvider/TransactionNotificationProvider';
// import { useTranslation } from 'react-i18next';

// export const useTransactionNotification = () => {
//   const { showNotification, hideNotification } = useTransactionNotificationContext()
//   const {t} = useTranslation("transaction");

//   return {
//     startTransaction: () => {
//       showNotification('progress', t('t1'));
//     },
//     failTransaction: (retryHandler: () => void) => {
//       showNotification('error', t('t2'), retryHandler);
//     },
//     completeTransaction: () => {
//       hideNotification()
//       showNotification('new_item', t('t3'));
//     }
//   };
// };



import { useDispatch } from 'react-redux';
import {
  startTransaction as startTransactionAction,
  completeTransaction as completeTransactionAction,
  failTransaction as failTransactionAction,
  hideNotification as hideNotificationAction,
  setCurrentTrxId as setCurrentTrxIdAction
} from '../redux/slices/transactionNotificationSlice';

export const useTransactionNotification = () => {
  const dispatch = useDispatch();

  const startTransaction = (message?: string) => {
    dispatch(startTransactionAction({ message }));
  };

  const completeTransaction = (message?: string) => {
    dispatch(completeTransactionAction({ message }));
  };

  const failTransaction = (retryFunction?: () => void) => {
    dispatch(failTransactionAction({ retryFunction }));
  };

  const hideNotification = () => {
    dispatch(hideNotificationAction());
  };

  const setCurrentTrxId = (trxId: string) => {
    dispatch(setCurrentTrxIdAction(trxId));
  };

  return {
    startTransaction,
    completeTransaction,
    failTransaction,
    hideNotification,
    setCurrentTrxId
  };
};