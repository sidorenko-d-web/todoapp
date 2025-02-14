import styles from './TransactionNotifcation.module.scss'
import { handAnimation } from '../../assets/animations';
import refresh from "../../assets/icons/refresh.svg"
import { TickCircle } from "../../assets/icons/tickCircle";
import Lottie from 'lottie-react';
import { useTranslation } from 'react-i18next';

interface TransactionNotificationProps {
  type: 'progress' | 'error' | 'new_item';
  message: string;
  onClose?: () => void;
  onRetry?: () => void;
}

export const TransactionNotification: React.FC<TransactionNotificationProps> = ({ type, message, onRetry }) => {
  const {t} = useTranslation('settings')

  return (
    <div className={styles.transactionIndicator}>
      <div className={`${styles.transactionIndicator__content} 
        ${type === 'error' ? styles.error : ''} 
        ${type === 'new_item' ? styles.success : ''}`}
      >
        {type === 'error' ? (
          <>
            <span>{t('s9')}</span>
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
              animationData={handAnimation}
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