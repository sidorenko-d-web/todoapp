import { IEquipedRoomResponse } from '../../../../redux';
import styles from './Partials.module.scss';


import clsx from 'clsx';
import { useRoomItemsSlots } from '../../../../../translate/items/items.ts';
import { walls } from '../../../../constants';

interface props {
  room: IEquipedRoomResponse | undefined;
  isLoading: boolean;
}

export const Walls = ({ room, isLoading }: props) => {
  const RoomItemsSlots = useRoomItemsSlots();
  const equipedWall = room?.items.find(
    item => item.id === room.equipped_items.find(_item => _item.slot === RoomItemsSlots.wall.slot)?.id,
  );
 
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
