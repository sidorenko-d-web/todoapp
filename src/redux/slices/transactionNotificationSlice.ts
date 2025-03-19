import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TransactionNotificationType = 'progress' | 'error' | 'new_item';

interface TransactionNotificationState {
  isVisible: boolean;
  type: TransactionNotificationType;
  message: string;
  currentTrxId: string | null;
  retryFunction: (() => void) | null;
}

const initialState: TransactionNotificationState = {
  isVisible: false,
  type: 'progress',
  message: '',
  currentTrxId: null,
  retryFunction: null,
};

export const transactionNotificationSlice = createSlice({
  name: 'transactionNotification',
  initialState,
  reducers: {
    startTransaction: (state, action: PayloadAction<{ message?: string; trxId?: string }>) => {
      state.isVisible = true;
      state.type = 'progress';
      state.message = action.payload.message || 'Transaction in progress...';
      state.currentTrxId = action.payload.trxId || null;
    },
    completeTransaction: (state, action: PayloadAction<{ message?: string }>) => {
      state.isVisible = true;
      state.type = 'new_item';
      state.message = action.payload.message || 'Transaction completed!';
      state.retryFunction = null;
    },
    failTransaction: (state, action: PayloadAction<{ retryFunction?: () => void }>) => {
      state.isVisible = true;
      state.type = 'error';
      state.message = 'Transaction failed';
      state.retryFunction = action.payload.retryFunction || null;
    },
    hideNotification: (state) => {
      state.isVisible = false;
    },
    setCurrentTrxId: (state, action: PayloadAction<string>) => {
      state.currentTrxId = action.payload;
    },
  },
});

export const {
  startTransaction,
  completeTransaction,
  failTransaction,
  hideNotification,
  setCurrentTrxId,
} = transactionNotificationSlice.actions;

export const transactionNotificationReducer = transactionNotificationSlice.reducer;