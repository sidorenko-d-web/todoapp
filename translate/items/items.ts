import { useTranslation } from 'react-i18next';

export interface RoomItemSlot {
  slot: number;
  name: string[];
}

interface RoomItemsSlots {
  wall: RoomItemSlot;
  floor: RoomItemSlot;
  desc: RoomItemSlot;
  chair: RoomItemSlot;
  sofa: RoomItemSlot;
  window: RoomItemSlot;
  poster: RoomItemSlot;
  lens: RoomItemSlot;
  note: RoomItemSlot;
  lightPortable: RoomItemSlot;
  carpet: RoomItemSlot;
  camera: RoomItemSlot;
  stand: RoomItemSlot;
  lightDesc: RoomItemSlot;
  mic: RoomItemSlot;
  photograph: RoomItemSlot;
  pc: RoomItemSlot;
  pen: RoomItemSlot;
  lamp: RoomItemSlot;
  ottoman: RoomItemSlot;
  plant: RoomItemSlot;
}

export const useRoomItemsSlots = (): RoomItemsSlots => {
  const { t } = useTranslation('roomItems');

  return {
    wall: {
      slot: 0,
      name: t('wall', { returnObjects: true }) as string[],
    },
    floor: {
      slot: 1,
      name: t('floor', { returnObjects: true }) as string[],
    },
    desc: {
      slot: 2,
      name: t('desc', { returnObjects: true }) as string[],
    },
    chair: {
      slot: 3,
      name: t('chair', { returnObjects: true }) as string[],
    },
    sofa: {
      slot: 4,
      name: t('sofa', { returnObjects: true }) as string[],
    },
    window: {
      slot: 5,
      name: t('window', { returnObjects: true }) as string[],
    },
    poster: {
      slot: 6,
      name: t('poster', { returnObjects: true }) as string[],
    },
    lens: {
      slot: 7,
      name: t('lens', { returnObjects: true }) as string[],
    },
    note: {
      slot: 8,
      name: t('note', { returnObjects: true }) as string[],
    },
    lightPortable: {
      slot: 9,
      name: t('lightPortable', { returnObjects: true }) as string[],
    },
    carpet: {
      slot: 10,
      name: t('carpet', { returnObjects: true }) as string[],
    },
    camera: {
      slot: 11,
      name: t('camera', { returnObjects: true }) as string[],
    },
    stand: {
      slot: 12,
      name: t('stand', { returnObjects: true }) as string[],
    },
    lightDesc: {
      slot: 13,
      name: t('lightDesc', { returnObjects: true }) as string[],
    },
    mic: {
      slot: 14,
      name: t('mic', { returnObjects: true }) as string[],
    },
    photograph: {
      slot: 15,
      name: t('photograph', { returnObjects: true }) as string[],
    },
    pc: {
      slot: 16,
      name: t('pc', { returnObjects: true }) as string[],
    },
    pen: {
      slot: 17,
      name: t('pen', { returnObjects: true }) as string[],
    },
    lamp: {
      slot: 18,
      name: t('lamp', { returnObjects: true }) as string[],
    },
    ottoman: {
      slot: 19,
      name: t('ottoman', { returnObjects: true }) as string[],
    },
    plant: {
      slot: 20,
      name: t('plant', { returnObjects: true }) as string[],
    },
  };
};