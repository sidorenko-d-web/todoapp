import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { IShopSkinsResponse, IShopItemsResponse, IShopItemsRequest, IBoosts } from '../shop';

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: baseQueryReauth,
  tagTypes: ['items', 'skins'],
  endpoints: builder => ({
    getInventorySkins: builder.query<IShopSkinsResponse, void>({
      query: () => ({
        url: `/inventory/skins`,
        method: 'GET',
      }),
      providesTags: ['skins'],
    }),
    getInventoryItems: builder.query<IShopItemsResponse, IShopItemsRequest | void>({
      query: (params) => ({
        url: `/inventory/items`,
        method: 'GET',
        params: params || {}
      }),
      providesTags: ['items'],
    }),
    getInventoryBoost: builder.query<IBoosts, void>({
      query: () => ({
        url: '/inventory/boost',
        method: 'GET',
      }),
      providesTags: ['skins', 'items'],
    }),
  }),
});

export const { useGetInventoryItemsQuery, useGetInventoryBoostQuery, useGetInventorySkinsQuery } = inventoryApi;
