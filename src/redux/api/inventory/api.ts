import {
  IShopSkinsResponse,
  IShopItemsResponse,
  IShopItemsRequest,
  IAchievementsResponse,
  shopApi,
  IBuyItemRequest,
} from '../shop';

export const inventoryApi = shopApi.injectEndpoints({
  endpoints: builder => ({
    getInventorySkins: builder.query<IShopSkinsResponse, void>({
      query: () => ({
        url: `/inventory/skins`,
        method: 'GET',
      }),
      providesTags: ['skins'],
    }),

    getInventoryItems: builder.query<IShopItemsResponse, IShopItemsRequest | void>({
      query: params => ({
        url: `/inventory/items`,
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['items'],
    }),

    upgradeItem: builder.mutation<any, IBuyItemRequest>({
      query: ({ id, ...params }) => ({
        url: `/inventory/upgrade/${id}`,
        method: 'PATCH',
        params,
      }),
      invalidatesTags: ['items'],
    }),

    getInventoryAchievements: builder.query<IAchievementsResponse, void>({
      query: () => ({
        url: '/inventory/achievements',
        method: 'GET',
      }),
      providesTags: ['achievements'],
    }),
  }),
});

// export const inventoryApi = createApi({
//   reducerPath: 'inventoryApi',
//   baseQuery: baseQueryReauth,
//   tagTypes: ['items', 'skins', 'achievements'],
//   endpoints:
// });

export const {
  useGetInventoryItemsQuery,
  useGetInventorySkinsQuery,
  useGetInventoryAchievementsQuery,
  useUpgradeItemMutation
} = inventoryApi;
