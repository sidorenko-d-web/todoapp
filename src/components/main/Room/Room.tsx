import { RoomItemsSlots, useGetEquipedByIdQuery, useGetEquipedQuery } from '../../../redux';
import { AnimationScene, Floor, Walls } from './partials';
import styles from './partials/Partials.module.scss';
import TreshinaRight from '../../../assets/images/start-room/treshina-right.svg';
import TreshinaLeft from '../../../assets/images/start-room/treshina-left.svg';
import Shelf from '../../../assets/images/start-room/shelf.svg';
import { getAchivementType } from '../../../helpers';
import { useGetCharacterByIdQuery, useGetCharacterQuery } from '../../../redux/api/character';

interface props {
  mode: 'me' | 'stranger';
  strangerId?: string;
}

export const Room = ({ mode, strangerId }: props) => {
  const { data: room } = useGetEquipedQuery(undefined, { skip: mode === 'stranger' });
  const character = useGetCharacterQuery(undefined, { skip: mode === 'stranger' });

  const { data: strangerRoom } = useGetEquipedByIdQuery({ id: strangerId! }, { skip: mode === 'me' && !strangerId });
  const strangerCharacter = useGetCharacterByIdQuery({ id: strangerId! }, { skip: mode === 'me' && !strangerId });

  const equippedAchivement = (room ?? strangerRoom)?.achievements?.[0];
  let achivementType;
  if (equippedAchivement) {
    achivementType = getAchivementType(equippedAchivement.name, equippedAchivement.level);
  }

  const isDefaultWall = !(room ?? strangerRoom)?.equipped_items.find(item => item.slot === RoomItemsSlots.wall.slot);

  return (
    <div className={styles.room}>
      <AnimationScene room={room ?? strangerRoom} character={mode === 'me' ? character : strangerCharacter} />

      <Walls room={room ?? strangerRoom} />

      {isDefaultWall && <img className={styles.treshinaLeft} src={TreshinaLeft} alt="trishimna-right" />}
      {isDefaultWall && <img className={styles.treshinaRight} src={TreshinaRight} alt="treshina-left" />}

      <img className={styles.shelf} src={Shelf} alt="shelf" />

      {achivementType && <img className={styles.reward} src={achivementType?.image} alt="reward" />}
      <Floor room={room ?? strangerRoom} />
    </div>
  );
};
