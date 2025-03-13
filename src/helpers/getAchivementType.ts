import { svgHeadersString } from '../constants';
import starGray from '../assets/icons/star-gray.svg';

export const getAchivementType = (name: string, medal: 'gold' | 'silver' | 'bronze' | number) => {
  const type = name.includes('капля') ? 'drop' : name.includes('этапа') ? 'stage' : 'integration';

  switch (type) {
    case 'drop':
      const imageNames = {
        Агатовая: 'Агат-1',
        Кварцевая: 'Кварц-2', //
        Серебряная: 'серебро-3', //
        Жемчужная: 'Жемчужина-4',
        Изумрудная: 'Изумруд-5', //
        Золотая: 'Золото-6', //
        Рубиновая: 'рубин-7', //
        Аметистовая: 'Аметист-8', //
        Алмазная: 'Алмаз-9',
        Обсидиановая: 'Обсидиан-10',
        Топазовая: 'Топаз-11',
        Бриллиантовая: 'Брилиант-12',
        Сапфировая: 'Спафир-13',
      };
      const itemName = name.split(' ');
      return {
        image: `https://miniapp.apusher.com/export/Награда -${
          imageNames[itemName[0] as keyof typeof imageNames]
        }.svg${svgHeadersString}`,
        type,
      };

    case 'integration':
      const _itemName = name.split(' ');
      let level;
      if (typeof medal === 'number') {
        level = medal;
      } else {
        level = medal === 'bronze' ? 1 : medal === 'silver' ? 2 : 3;
      }
      return {
        image: `https://miniapp.apusher.com/export/${
          _itemName[_itemName.length - 1]
        }-${level}.svg${svgHeadersString}`,
        type,
      };

    default:
      return { image: starGray, type };
  }
};
