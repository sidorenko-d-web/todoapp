import { IEquipedRoomResponse } from '../../../../redux';
import styles from './Partials.module.scss';

import redBase from '../../../../assets/images/walls/Бетонные-стены-1.svg';
import redAdvanced from '../../../../assets/images/walls/Бетонные-стены-2.svg';
import redPro from '../../../../assets/images/walls/Бетонные-стены-3.svg';

import yellowBase from '../../../../assets/images/walls/Стена-1.svg';
import yellowAdvanced from '../../../../assets/images/walls/Стена-1-1.svg';
import yellowPro from '../../../../assets/images/walls/Стена-1-2.svg';

import greenBase from '../../../../assets/images/walls/Обои-1.svg';
import greenAdvanced from '../../../../assets/images/walls/Обои-2.svg';
import greenPro from '../../../../assets/images/walls/Обои-3.svg';

import clsx from 'clsx';
import { useRoomItemsSlots } from '../../../../../translate/items/items.ts';

interface props {
  room: IEquipedRoomResponse | undefined;
  isLoading: boolean;
}

export const Walls = ({ room, isLoading }: props) => {
  const RoomItemsSlots = useRoomItemsSlots();
  const equipedWall = room?.items.find(
    item => item.id === room.equipped_items.find(_item => _item.slot === RoomItemsSlots.wall.slot)?.id,
  );
  const walls = {
    redbase: {
      image: redBase,
      isSkew: true,
    },
    redadvanced: {
      image: redAdvanced,
      isSkew: true,
    },
    redpro: {
      image: redPro,
      isSkew: true,
    },

    yellowbase: {
      image: yellowBase,
      isSkew: true,
    },
    yellowadvanced: {
      image: yellowAdvanced,
      isSkew: true,
    },
    yellowpro: {
      image: yellowPro,
      isSkew: true,
    },

    greenbase: {
      image: greenBase,
      isSkew: true,
    },
    greenadvanced: {
      image: greenAdvanced,
      isSkew: true,
    },
    greenpro: {
      image: greenPro,
      isSkew: true,
    },
  };
  const currentWall =
    walls[(equipedWall?.item_rarity! + equipedWall?.item_premium_level) as keyof typeof walls] ?? walls.redbase;

  // const currentWall = walls.yellowpro

  return (
    <div className={styles.wallsWrapper}>
      {!isLoading && (
        <>
          <div className={styles.wallLeft}>
            <img src={currentWall?.image} className={clsx(styles.skewed)} alt="" />
          </div>
          <div className={styles.wallRight}>
            <img src={currentWall?.image} className={clsx(styles.skewed)} alt="" />
          </div>
        </>
      )}
    </div>
  );
};
