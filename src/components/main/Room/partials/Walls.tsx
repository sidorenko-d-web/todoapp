import { IEquipedRoomResponse, RootState } from '../../../../redux';
import styles from './Partials.module.scss';
import greenWallUp from '../../../../assets/images/walls/green-wall-up.svg';
import greenWallDown from '../../../../assets/images/walls/green-wall-down.svg';

import greenWallDotted from '../../../../assets/images/walls/green-wall-dotted.svg';
import blueRedWall from '../../../../assets/images/walls/blue-red-wall.svg';
import blueWall from '../../../../assets/images/walls/blue-wall.svg';
import yellowWall from '../../../../assets/images/walls/yellow wall62.svg';
import clsx from 'clsx';
import { useRoomItemsSlots } from '../../../../../translate/items/items.ts';
import { useSelector } from 'react-redux';


interface props {
  room: IEquipedRoomResponse | undefined;
}

export const Walls = ({ room }: props) => {
  const RoomItemsSlots = useRoomItemsSlots();
  const equipedWall = room?.items.find(
    item => item.id === room.equipped_items.find(_item => _item.slot === RoomItemsSlots.wall.slot)?.id,
  );

  const redWalls = {
    default: '#bbc2d4',
    base: '#E88A8B',
    advanced: '#87C2CC',
    pro: '#98B75C',
  };

  const walls = {
    greenWall: {
      image: greenWallUp,
      isSkew: true,
      name: 'greenbase',
      isBottomPart: true,
    },
    greenWallDotted: {
      image: greenWallDotted,
      isSkew: true,
      name: 'yellowpro',
      isBottomPart: false,
    },
    blueRedWall: {
      image: blueRedWall,
      isSkew: false,
      name: 'greenpro',
      isBottomPart: false,
    },
    blueWall: {
      image: blueWall,
      isSkew: true,
      name: 'yellowadvanced',
      isBottomPart: false,
    },
    yellowWall: {
      image: yellowWall,
      isSkew: false,
      name: 'yellowbase',
      isBottomPart: false,
    },
  };

  const currentWall = Object.values(walls).find(
    item => item.name === equipedWall?.item_rarity! + equipedWall?.item_premium_level,
  );

  // const currentWall = walls.greenWallDotted

  const isAnimationSceneLoaded = useSelector((state: RootState) => state.mainSlice.isAnimationSceneLoaded)

  return (
    <div className={styles.wallsWrapper}>
      {isAnimationSceneLoaded && <>
        <div
          style={{
            backgroundColor: redWalls[equipedWall?.item_premium_level as keyof typeof redWalls] ?? redWalls.default,
          }}
          className={styles.wallLeft}
        >
          <img src={currentWall?.image} className={clsx(currentWall?.isSkew && styles.skewed)} alt="" />
          {currentWall?.isBottomPart && <img src={greenWallDown} alt="" className={styles.greenWallDown} />}
        </div>
        <div
          style={{
            backgroundColor: redWalls[equipedWall?.item_premium_level as keyof typeof redWalls] ?? redWalls.default,
          }}
          className={styles.wallRight}
        >
          <img src={currentWall?.image} className={clsx(currentWall?.isSkew && styles.skewed)} alt="" />
          {currentWall?.isBottomPart && <img src={greenWallDown} alt="" className={styles.greenWallDown} />}
        </div>
      </>}
    </div>
  );
};
