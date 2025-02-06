import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryReauth } from '../query';
import { IShopItemsResponse, IShopItemsRequest, IShopSkinsResponse, IBuyItemRequest } from './dto';

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: baseQueryReauth,
  tagTypes: ['items', 'skins', 'achievements'],
  endpoints: builder => ({
    getShopItems: builder.query<IShopItemsResponse, IShopItemsRequest>({
      query: params => ({
        url: `/shop/items`,
        method: 'GET',
        params,
      }),
      providesTags: ['items'],
    }),

    getShopSkins: builder.query<IShopSkinsResponse, void>({
      query: () => ({
        url: `/shop/skins`,
        method: 'GET',
      }),
      providesTags: ['skins'],
    }),

    buyItem: builder.mutation<any, IBuyItemRequest>({
      query: ({ id, ...params }) => ({
        url: `/shop/items/buy/${id}`,
        method: 'POST',
        params,
      }),
      invalidatesTags: ['items'],
    }),
    buySkin: builder.mutation<any, IBuyItemRequest>({
      query: ({ id, ...params }) => ({
        url: `/shop/skins/buy/${id}`,
        method: 'POST',
        params,
      }),
      invalidatesTags: ['items'],
    }),

   
  }),
});

export const {
  useGetShopItemsQuery,
  useGetShopSkinsQuery,
  useBuyItemMutation,
  useBuySkinMutation,
} = shopApi;
