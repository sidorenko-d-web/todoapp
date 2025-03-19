import { IShopItem, TypeItemQuality } from '../../redux';

export const compareItems = (item1: IShopItem, item2: IShopItem) => {
  return item1.name.toLowerCase() + item1.item_premium_level === item2.name.toLowerCase() + item2.item_premium_level;
};

export const filter = (item: IShopItem, inventoryItems?: IShopItem[]) => {
  const inventoryItem = inventoryItems?.find(_item => compareItems(item, _item));

  return !inventoryItem;
};

export const itemsInTab = (shopItems?: IShopItem[], inventoryItems?: IShopItem[]) => {
  const tabItems = {
    red: shopItems?.filter(item => item.item_rarity === 'red'),

    yellow: shopItems
      ?.filter(item => item.item_rarity === 'yellow')
      .filter(item =>
        inventoryItems?.find(
          _item =>
            _item.name === item.depends &&
            _item.level === 50 &&
            _item.item_premium_level === 'pro' &&
            item.item_premium_level === 'base',
        ),
      ),

    green: shopItems
      ?.filter(item => item.item_rarity === 'green')
      .filter(item =>
        inventoryItems?.find(
          _item =>
            _item.name === item.depends &&
            _item.level === 50 &&
            _item.item_premium_level === 'pro' &&
            item.item_premium_level === 'base',
        ),
      ),
  };
  return tabItems;
};

export const getPremiumLevelOrder = (level: TypeItemQuality) =>
  ({
    base: 0,
    advanced: 1,
    pro: 2,
  }[level]);

export function sortByPremiumLevel(items: IShopItem[]) {
  return [...items].sort(
    (a, b) => getPremiumLevelOrder(a.item_premium_level) - getPremiumLevelOrder(b.item_premium_level),
  );
}
