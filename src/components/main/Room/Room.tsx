import {
  useGetCharacterByIdQuery,
  useGetCharacterQuery,
  useGetEquipedByIdQuery,
  useGetEquipedQuery,
} from '../../../redux';
import { AnimationScene, Coin, Floor, Walls } from './partials';
import styles from './partials/Partials.module.scss';
import TreshinaRight from '../../../assets/images/start-room/treshina-right.svg';
import TreshinaLeft from '../../../assets/images/start-room/treshina-left.svg';
import Shelf from '../../../assets/images/start-room/shelf.svg';
import { getAchivementType } from '../../../helpers';
import { useRoomItemsSlots } from '../../../../translate/items/items.ts';
import { useMemo, useState } from 'react';
import { Loader } from '../../index.ts';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

interface props {
  mode: 'me' | 'stranger';
  strangerId?: string;
  setIsRoomLoaded?: (value: boolean) => void;
}

export const Room = ({ mode, strangerId, setIsRoomLoaded }: props) => {
  const { data: room, isLoading: isRoomLoading } = useGetEquipedQuery(undefined, { skip: mode === 'stranger' });
  const character = useGetCharacterQuery(undefined, { skip: mode === 'stranger' });

  const [isLoaded, setIsLoaded] = useState(false);

  const { data: strangerRoom, isLoading: isStrangerLoading } = useGetEquipedByIdQuery(
    { id: strangerId! },
    { skip: mode === 'me' && !strangerId },
  );
  const strangerCharacter = useGetCharacterByIdQuery({ id: strangerId! }, { skip: mode === 'me' && !strangerId });
  const RoomItemsSlots = useRoomItemsSlots();
  const equippedAchivement = (room ?? strangerRoom)?.achievements?.[0];
  let achivementType;
  if (equippedAchivement) {
    achivementType = getAchivementType(equippedAchivement.name, equippedAchivement.level);
  }

  const isDefaultWall = !(room ?? strangerRoom)?.equipped_items.find(item => item.slot === RoomItemsSlots.wall.slot);

  const isLoading = useMemo(
    () => !isLoaded || isStrangerLoading || isRoomLoading,
    [isLoaded, isStrangerLoading, isRoomLoading],
  );

  const isIntegrationPage = useLocation().pathname.includes('integrations');

  const handleSetIsRoomLoaded = (value: boolean) => {
    setIsLoaded(value)
    setIsRoomLoaded?.(value);
  };

  return (
    <div className={styles.room}>
      {isLoading && <Loader className={clsx(styles.loader, isIntegrationPage && styles.upper)} />}
      <AnimationScene
        setIsLoaded={handleSetIsRoomLoaded}
        room={room ?? strangerRoom}
        character={mode === 'me' ? character : strangerCharacter}
      />

      <Walls room={room ?? strangerRoom} isLoading={isLoading} />

      {!isLoading && (
        <>
          {isDefaultWall && <img className={styles.treshinaLeft} src={TreshinaLeft} alt="trishimna-right" />}
          {isDefaultWall && <img className={styles.treshinaRight} src={TreshinaRight} alt="treshina-left" />}

          <img className={styles.shelf} src={Shelf} alt="shelf" />
          <Coin isLoaded={isLoaded} strangerRoom={!!strangerRoom} />
          {achivementType && <img className={styles.reward} src={achivementType?.image} alt="reward" />}
        </>
      )}
      <Floor room={room ?? strangerRoom} />
    </div>
  );
};
