import { RoomItemsSlots, useGetEquipedQuery } from '../../../../redux';
import styles from './Partials.module.scss';
export const Walls = () => {
  const { data } = useGetEquipedQuery();

  const equipedWallLevel = data?.items.find(
    item => item.id === data.equipped_items.find(_item => _item.slot === RoomItemsSlots.wall.slot)?.id,
  )?.item_premium_level;

  const redWalls = {
    default: '#bbc2d4',
    base: '#E88A8B',
    advanced: '#87C2CC',
    pro: '#98B75C',
  };

  return (
    <div className={styles.wallsWrapper}>
      <div
        style={{ backgroundColor: redWalls[equipedWallLevel as keyof typeof redWalls] ?? redWalls.default }}
        className={styles.wallLeft}
      ></div>
      <div
        style={{ backgroundColor: redWalls[equipedWallLevel as keyof typeof redWalls] ?? redWalls.default }}
        className={styles.wallRight}
      ></div>
    </div>
  );
};
