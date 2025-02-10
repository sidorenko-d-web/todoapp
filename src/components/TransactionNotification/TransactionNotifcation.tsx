import styles from './TransactionNotifcation.module.scss'
import { handAnimation } from '../../assets/animations';
import refresh from "../../assets/Icons/refresh.svg"
import Lottie from 'lottie-react';


interface TransactionNotificationProps {
  type: string | 'progress' | 'error';
  message: string;
  onClose: () => void;
  onRetry?: () => void;
}

export const TransactionNotification: React.FC<TransactionNotificationProps> = ({ type, message, onClose, onRetry }) => {
  return (
    <div className={styles.transactionIndicator}>
      <div className={`${styles.transactionIndicator__content} ${type === 'error' ? styles.error : ''}`}>
        {type === 'error' ? (
          <>
            <span>Ошибка транзакции!</span>
            <button onClick={onRetry} className={styles.retryButton}>
              <img src={refresh} alt="Retry transaction" />
            </button>
          </>
        ) : (
          <>
            <Lottie
              animationData={handAnimation}
              loop={true}
              autoplay={true}
              className={styles.lottie}
            />
            <span>Обработка транзакции...</span>
          </>
        )}
      </div>
    </div>
  );
};

