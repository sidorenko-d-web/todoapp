import { useGetEquipedByIdQuery, useGetEquipedQuery, useGetProfileMeQuery } from '../../../redux';
import { AnimationScene, Floor, Walls } from './partials';
import styles from './partials/Partials.module.scss';
import TreshinaRight from '../../../assets/images/start-room/treshina-right.svg';
import TreshinaLeft from '../../../assets/images/start-room/treshina-left.svg';
import Shelf from '../../../assets/images/start-room/shelf.svg';
import CoinIcon from '../../../assets/icons/coin.png';
import { getAchivementType } from '../../../helpers';
import { useGetCharacterByIdQuery, useGetCharacterQuery } from '../../../redux/api/character';
import { useRoomItemsSlots } from '../../../../translate/items/items.ts';
import { useIncrementingProfileStats } from '../../../hooks/useIncrementingProfileStats.ts';
import { useEffect, useState } from 'react';
import { Loader } from '../../index.ts';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

interface props {
  mode: 'me' | 'stranger';
  strangerId?: string;
}

export const Room = ({ mode, strangerId }: props) => {
  const { data: room, isLoading: isRoomLoading } = useGetEquipedQuery(undefined, { skip: mode === 'stranger' });
  const character = useGetCharacterQuery(undefined, { skip: mode === 'stranger' });
  const { data } = useGetProfileMeQuery(undefined, {
  });

  const [isLoaded, setIsLoaded] = useState(false);

  const { points: displayedPoints } = useIncrementingProfileStats({
    profileId: data?.id || '',
    basePoints: data?.points || '0',
    baseSubscribers: data?.subscribers || 0,
    baseTotalViews: data?.total_views || 0,
    baseTotalEarned: data?.total_earned || '0',
    futureStatistics: data?.future_statistics,
    lastUpdatedAt: data?.updated_at,
  });

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

  const [didIncreased, setDidIncreased] = useState(false);
  const playCoin = () => {
    if (didIncreased && isLoaded) return;
    setDidIncreased(true);
    setTimeout(() => {
      setDidIncreased(false);
    }, 1150);
  };

  useEffect(() => {
    playCoin();
  }, [displayedPoints]);

  const isLoading = !isLoaded || isStrangerLoading || isRoomLoading;

  const isIntegrationPage = useLocation().pathname.includes('integrations')

  return (
    <div className={styles.room}>
      <AnimationScene
        setIsLoaded={setIsLoaded}
        room={room ?? strangerRoom}
        character={mode === 'me' ? character : strangerCharacter}
      />

      {isLoading && <Loader className={clsx(styles.loader, isIntegrationPage && styles.upper)} />}
      <Walls room={room ?? strangerRoom} isLoading={isLoading} />

      {!isLoading && (
        <>
          {isDefaultWall && <img className={styles.treshinaLeft} src={TreshinaLeft} alt="trishimna-right" />}
          {isDefaultWall && <img className={styles.treshinaRight} src={TreshinaRight} alt="treshina-left" />}

          <img className={styles.shelf} src={Shelf} alt="shelf" />
          {didIncreased && !strangerRoom && <img className={styles.coin} src={CoinIcon} alt="shelf" />}

          {achivementType && <img className={styles.reward} src={achivementType?.image} alt="reward" />}
          <Floor room={room ?? strangerRoom} />
        </>
      )}
    </div>
  );
};
