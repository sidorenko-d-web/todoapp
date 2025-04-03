import blueGift from '../assets/icons/gift.svg';
import purpleGift from '../assets/icons/gift-purple.svg';
import redGift from '../assets/icons/gift-red.svg';
import blueChest from '../assets/icons/chest-blue.svg';
import purpleChest from '../assets/icons/chest-purple.svg';
import redChest from '../assets/icons/chest-red.svg';

const translations = {
  ru: {
    stoneChest: 'Каменный сундук',
    rareChest: 'Редкий сундук',
    legendaryChest: 'Легендарный сундук',
    blueGift: 'Синий подарок',
    purpleGift: 'Фиолетовый подарок',
    redGift: 'Красный подарок',
  },
  en: {
    stoneChest: 'Stone Chest',
    rareChest: 'Rare Chest',
    legendaryChest: 'Legendary Chest',
    blueGift: 'Blue Gift',
    purpleGift: 'Purple Gift',
    redGift: 'Red Gift',
  },
};

export const getNextLevelReward = (level: number, locale: 'ru' | 'en' = 'en') => {
  const t = translations[locale];

  if (level === 50) {
    return { icon: blueChest, name: t.stoneChest };
  }
  if (level === 100) {
    return { icon: purpleChest, name: t.rareChest };
  }
  if (level === 150) {
    return { icon: redChest, name: t.legendaryChest };
  }

  if (level >= 1 && level <= 50) {
    return { icon: blueGift, name: t.blueGift };
  }
  if (level > 50 && level <= 100) {
    return { icon: purpleGift, name: t.purpleGift };
  }
  if (level > 100 && level <= 150) {
    return { icon: redGift, name: t.redGift };
  }

  return null;
};
