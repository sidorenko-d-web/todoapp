// types.ts
import { IShopItem } from '../redux';

export type NotificationType = 'progress' | 'error';

export interface PaymentRetryHandler {
  (): Promise<void>;
}

export interface NotificationState {
  visible: boolean;
  type: NotificationType;
  message: string;
}

export interface TransactionContextType {
  showNotification: (type: NotificationType, message: string, retryHandler?: PaymentRetryHandler) => void;
  hideNotification: () => void;
  setTransactionItem: (item: IShopItem) => void;
  transactionItem: IShopItem | null;
  handleUsdtPayment: PaymentRetryHandler | null;
}

export interface TransactionNotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
}