import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfirmationState {
  inputValue: string; 
  inputType: 'email' | 'phone';
}

const initialState: ConfirmationState = {
  inputValue: '',
  inputType: 'email',
};

const confirmation = createSlice({
  name: 'confirmation',
  initialState,
  reducers: {
    setInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload;
    },
    setInputType: (state, action: PayloadAction<'email' | 'phone'>) => {
      state.inputType = action.payload;
    },
    resetConfirmationState: (state) => {
      state.inputValue = '';
      state.inputType = 'email';
    },
  },
});

export const { setInputValue, setInputType, resetConfirmationState } = confirmation.actions;

export default confirmation.reducer;