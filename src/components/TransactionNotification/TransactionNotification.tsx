import styles from './TransactionNotification.module.scss'
import { coinLoadingAnimation } from '../../assets/animations';
import refresh from "../../assets/Icons/refresh.svg"
import { TickCircle } from "../../assets/Icons/tickCircle";
import Lottie from 'lottie-react';
import { useTranslation } from 'react-i18next';

interface TransactionNotificationProps {
  type: 'progress' | 'error' | 'new_item';
  message: string;
  onClose?: () => void;
  onRetry?: () => void;
}

export const TransactionNotification: React.FC<TransactionNotificationProps> = ({ type, message, onRetry }) => {
  const {t} = useTranslation('transaction')

  return (
    <div className={styles.transactionIndicator}>
      <div className={`${styles.transactionIndicator__content} 
        ${type === 'error' ? styles.error : ''} 
        ${type === 'new_item' ? styles.success : ''}`}
      >
        {type === 'error' ? (
          <>
            <span>{t('t2')}</span>
            <button onClick={onRetry} className={styles.retryButton}>
              <img src={refresh} alt="Retry transaction" />
            </button>
          </>
        ) : type === 'new_item' ? (
          <>
            <div className={styles.checkIcon}>
              <TickCircle />
            </div>
            <span>{message}</span>
          </>
        ) : (
          <>
            <Lottie
              animationData={coinLoadingAnimation}
              loop={true}
              autoplay={true}
              className={styles.lottie}
            />
            <span>{message}</span>
          </>
        )}
      </div>
    </div>
  );
};