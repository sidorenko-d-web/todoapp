import { RoomItemsSlots, useGetEquipedQuery } from '../../../redux';
import { AnimationScene, Floor, Walls } from './partials';
import styles from './partials/Partials.module.scss';
import TreshinaRight from '../../../assets/images/start-room/treshina-right.svg';
import TreshinaLeft from '../../../assets/images/start-room/treshina-left.svg';
import Shelf from '../../../assets/images/start-room/shelf.svg';

export const Room = () => {
  const { data } = useGetEquipedQuery();
  return (
    <div className={styles.room}>
      <AnimationScene />
      <Walls />

      {!data?.room.equipped_items.find(item => item.slot === RoomItemsSlots.wall.slot) && (
        <img className={styles.treshinaLeft} src={TreshinaLeft} alt="trishimna-right" />
      )}
      {!data?.room.equipped_items.find(item => item.slot === RoomItemsSlots.wall.slot) && (
        <img className={styles.treshinaRight} src={TreshinaRight} alt="treshina-left" />
      )}
      <img className={styles.shelf} src={Shelf} alt="shelf" />

      <Floor />
    </div>
  );
};
