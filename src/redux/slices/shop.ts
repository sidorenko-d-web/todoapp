import { createSlice } from '@reduxjs/toolkit';
import { TypeItemCategory, TypeItemRarity } from '../api';

type TypeTab<T> = { title: string; value: T };

type State = {
  lastOpenedTab?: TypeTab<TypeItemCategory>;
  lastOpenedRarity?: TypeTab<TypeItemRarity>;
};

const initialState: State = {
  lastOpenedTab: undefined,
  lastOpenedRarity: undefined,
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setLastOpenedTab(state, action) {
      state.lastOpenedTab = action.payload;
    },
    setLastOpenedRarity(state, action) {
      state.lastOpenedRarity = action.payload;
    },
  },
});

export const { setLastOpenedTab, setLastOpenedRarity } = shopSlice.actions;
export const shopReducer = shopSlice.reducer;
