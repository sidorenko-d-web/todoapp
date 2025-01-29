import { useMemo } from 'react';
import { useGetInventoryItemsQuery } from '../redux/api/inventory/api.ts';
import { IShopItem } from '../types/shop/ShopApiTypes.ts';

type CategorizedItems = {
  text: IShopItem[];
  image: IShopItem[];
  video: IShopItem[];
  decor: IShopItem[];
}

export const useInventoryItemsFilter = () => {
  const { data, isLoading, refetch } = useGetInventoryItemsQuery();

  const items = useMemo(() => data?.items || [], [ data ]);

  const categorizedItems = useMemo(() => {
    const categories: CategorizedItems = { text: [], image: [], video: [], decor: [] };

    items.forEach(item => {
      console.log(item);
      if (categories[item.item_category]) {
        categories[item.item_category].push(item);
      }
    });

    return categories;
  }, [ items ]);

  return {
    isLoading,
    refetch,
    ...categorizedItems,
    hasText: categorizedItems.text.length > 0,
    hasImage: categorizedItems.image.length > 0,
    hasVideo: categorizedItems.video.length > 0,
    hasDecor: categorizedItems.decor.length > 0,
  } as const;
};
