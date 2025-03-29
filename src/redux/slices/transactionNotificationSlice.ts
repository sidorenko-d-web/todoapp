import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TransactionNotificationType = 'progress' | 'error' | 'new_item';

export interface TransactionData {
  trxId: string;
  hash: string;
  from_address: string;
}

interface TransactionNotificationState {
  isVisible: boolean;
  type: TransactionNotificationType;
  message: string;
  currentTrxId: string | null;
  retryFunction: (() => void) | null;
  transactionData: TransactionData | null;
  activePage: string | null; // Track which page the notification belongs to
}

const initialState: TransactionNotificationState = {
  isVisible: false,
  type: 'progress',
  message: '',
  currentTrxId: null,
  retryFunction: null,
  transactionData: null,
  activePage: null,
};

export const transactionNotificationSlice = createSlice({
  name: 'transactionNotification',
  initialState,
  reducers: {
    startTransaction: (state, action: PayloadAction<{ 
      message?: string; 
      trxId?: string; 
      activePage?: string;
    }>) => {
      state.isVisible = true;
      state.type = 'progress';
      state.message = action.payload.message || 'Transaction in progress...';
      state.currentTrxId = action.payload.trxId || null;
      state.transactionData = null;
      state.activePage = action.payload.activePage || null;
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
      state.transactionData = null;
    },
    
    hideNotification: (state) => {
      state.isVisible = false;
    },
    
    setTransactionData: (state, action: PayloadAction<TransactionData>) => {
      state.transactionData = action.payload;
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
  setTransactionData,
  setCurrentTrxId,
} = transactionNotificationSlice.actions;

export const transactionNotificationReducer = transactionNotificationSlice.reducer;