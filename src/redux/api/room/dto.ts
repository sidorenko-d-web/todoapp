import { IAchievement, IShopItem } from '../shop';

export type BoostDTO = {
  income_per_second: string;
  subscribers: number;
  views: number;
};

export interface IEquipedRoomResponse {
  items: IShopItem[];
  equipped_items: IRoomItem[];
}

export interface IRoom {
  id: string;
}

export interface IRoomItem {
  id: string;
  slot: number;
}

export interface IEquipItemRequest {
  equipped_items: IRoomItem[];
  equipped_achievements: IAchievement[];
}
export interface IRemoveItemRequest {
  items_to_remove: { id: string }[];
  achievements_to_remove: { id: string }[];
}

export const RoomItemsSlots = {
  wall: {
    slot: 0,
    name: ['Бетонные стены', 'Стены', 'Обои'],
  },
  floor: {
    slot: 1,
    name: ['Пол', 'Ламинат', 'Плитка'],
  },
  desc: {
    slot: 2,
    name: ['Столик', 'Стол', 'Стол массив'],
  },
  chair: {
    slot: 3,
    name: ['Стул', 'Компьютерный стул', 'Игровое кресло'],
  },
  sofa: {
    slot: 4,
    name: ['Диванчик', 'Диван', 'Диван дизайнерский'],
  },
  window: {
    slot: 5,
    name: ['Деревянное окно', 'Окно', 'Двойное окно'],
  },
  poster: {
    slot: 6,
    name: ['Постер', 'Постеры в деревянной рамке', 'Картина LED'],
  },
  lens: {
    slot: 7,
    name: ['Объектив', 'Объектив широкоугольный', 'Объектив профессиональный'],
  },
  note: {
    slot: 8,
    name: ['Тетрадь', 'Блокнот', 'Планшет'],
  },
  lightPortable: {
    slot: 9,
    name: ['Свет портативный', 'Осветитель', 'Осветитель студийный'],
  },
  carpet: {
    slot: 10,
    name: ['Коврик', 'Палас', 'Ковер'],
  },
  camera: {
    slot: 11,
    name: ['Камера любительская', 'Камера профессиональная', 'Кинокамера'],
  },
  stand: {
    slot: 12,
    name: ['Штатив', 'Штатив регулируемый', 'Штатив карбоновый'],
  },
  lightDesc: {
    slot: 13,
    name: ['Лампа настольная', 'Лампа кольцевая', 'Свет студийный'],
  },
  mic: {
    slot: 14,
    name: ['Микрофон петличный', 'Конденсаторный микрофон', 'Микрофон беспроводной'],
  },
  photograph: {
    slot: 15,
    name: ['Мыльница', 'Фотоаппарат', 'Фотоаппарат зеркальный'],
  },
  pc: {
    slot: 16,
    name: ['Печатная машинка', 'ПК', 'Ноутбук'],
  },
  pen: {
    slot: 17,
    name: ['Карандаш', 'Ручка', 'Стилус'],
  },
  lamp: {
    slot: 18,
    name: ['Лампа', 'Лампа умная', 'Лампа дизайнейрская'],
  },
  ottoman: {
    slot: 19,
    name: ['Пуф', 'Пуф мешок', 'Кресло'],
  },
  plant: {
    slot: 20,
    name: ['Кактус', 'Фикус', 'Монстера'],
  },
};
