import { RoomItemsSlots, useGetEquipedQuery, useGetInventoryAchievementsQuery } from '../../../redux';
import { AnimationScene, Floor, Walls } from './partials';
import styles from './partials/Partials.module.scss';
import TreshinaRight from '../../../assets/images/start-room/treshina-right.svg';
import TreshinaLeft from '../../../assets/images/start-room/treshina-left.svg';
import Shelf from '../../../assets/images/start-room/shelf.svg';
import { useLocation } from 'react-router-dom';
import { getAchivementType } from '../../../helpers';
import { AppRoute } from '../../../constants';

export const Room = () => {
  const { data } = useGetEquipedQuery();
  const { data: achivements } = useGetInventoryAchievementsQuery();

  const location = useLocation().pathname;

  const equippedAchivement = data?.achievements?.[0];
  let achivementType;
  if (equippedAchivement) {
    achivementType = getAchivementType(equippedAchivement.name, equippedAchivement.level);
  }

  console.log(achivements?.achievements.filter(item => !item.name.includes('этапа')))
  return (
    <div className={styles.room}>
      {location === AppRoute.Main && <AnimationScene />}
      <Walls />
      {!data?.equipped_items.find(item => item.slot === RoomItemsSlots.wall.slot) && (
        <img className={styles.treshinaLeft} src={TreshinaLeft} alt="trishimna-right" />
      )}
      {!data?.equipped_items.find(item => item.slot === RoomItemsSlots.wall.slot) && (
        <img className={styles.treshinaRight} src={TreshinaRight} alt="treshina-left" />
      )}
      <img className={styles.shelf} src={Shelf} alt="shelf" />
      {achivementType && <img className={styles.reward} src={achivementType?.image} alt="reward" />}
      <Floor />
    </div>
  );
};
