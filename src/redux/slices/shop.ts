import { createSlice } from '@reduxjs/toolkit';
import { TypeItemCategory, TypeItemRarity } from '../api';

type TypeTab<T> = { title: string; value: T };

type State = {
  lastOpenedTab?: TypeTab<TypeItemCategory>;
  lastOpenedRarity?: TypeTab<TypeItemRarity>;
  selectedIntegrationCategory?: TypeItemCategory;
};

const initialState: State = {
  lastOpenedTab: undefined,
  lastOpenedRarity: undefined,
  selectedIntegrationCategory: undefined,
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
    setSelectedIntegrationCategory: (state, action) => {
      state.selectedIntegrationCategory = action.payload;
    },
  },
});

export const { setLastOpenedTab, setLastOpenedRarity, setSelectedIntegrationCategory } = shopSlice.actions;
export const shopReducer = shopSlice.reducer;
