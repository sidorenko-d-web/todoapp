import {
  IAchievementsRequest,
  IAchievementsResponse,
  IBuyItemRequest,
  IInventoryItemsRequest,
  IShopItemsResponse,
  IShopSkinsResponse,
  shopApi,
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

    getInventoryItems: builder.query<IShopItemsResponse, IInventoryItemsRequest | void>({
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

    getInventoryAchievements: builder.query<IAchievementsResponse, IAchievementsRequest | void>({
      query: () => ({
        url: '/inventory/achievements',
        method: 'GET',
        params: { is_unlocked: true },
      }),
      providesTags: ['achievements'],
    }),
  }),
});

export const {
  useGetInventoryItemsQuery,
  useGetInventorySkinsQuery,
  useGetInventoryAchievementsQuery,
  useUpgradeItemMutation,
} = inventoryApi;
