import { RootState, useGetCurrentUserProfileInfoForPollingQuery, useGetEquipedByIdQuery, useGetEquipedQuery } from '../../../redux';
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
import { useSelector } from 'react-redux';
import { Loader } from '../../index.ts';

interface props {
  mode: 'me' | 'stranger';
  strangerId?: string;
}

export const Room = ({ mode, strangerId }: props) => {
  const { data: room } = useGetEquipedQuery(undefined, { skip: mode === 'stranger' });
  const character = useGetCharacterQuery(undefined, { skip: mode === 'stranger' });
  const { data } = useGetCurrentUserProfileInfoForPollingQuery(undefined, {
      pollingInterval: 10000, // 10 сек
    });

    const { points: displayedPoints } = useIncrementingProfileStats({
      profileId: data?.id || '',
      basePoints: data?.points || '0',
      baseSubscribers: data?.subscribers || 0,
      baseTotalViews: data?.total_views || 0,
      baseTotalEarned: data?.total_earned || '0',
      futureStatistics: data?.future_statistics,
      lastUpdatedAt: data?.updated_at,
    });

  const { data: strangerRoom } = useGetEquipedByIdQuery({ id: strangerId! }, { skip: mode === 'me' && !strangerId });
  const strangerCharacter = useGetCharacterByIdQuery({ id: strangerId! }, { skip: mode === 'me' && !strangerId });
  const RoomItemsSlots = useRoomItemsSlots();
  const equippedAchivement = (room ?? strangerRoom)?.achievements?.[0];
  let achivementType;
  if (equippedAchivement) {
    achivementType = getAchivementType(equippedAchivement.name, equippedAchivement.level);
  }

  const isDefaultWall = !(room ?? strangerRoom)?.equipped_items.find(item => item.slot === RoomItemsSlots.wall.slot);

  const [didIncreased, setDidIncreased] = useState(false)
  const playCoin = () => {
    if(didIncreased) return
    console.log('first')
    setDidIncreased(true)
    setTimeout(() => {

      setDidIncreased(false)
    }, 1150)
  }

  useEffect(() => {
    playCoin()
  }, [displayedPoints])

  const isAnimationSceneLoaded = useSelector((state: RootState) => state.mainSlice.isAnimationSceneLoaded)

  return (
    <div className={styles.room}>
      <AnimationScene room={room ?? strangerRoom} character={mode === 'me' ? character : strangerCharacter} />

      <Walls room={room ?? strangerRoom} />

      {!isAnimationSceneLoaded && <Loader/>}

      {
        isAnimationSceneLoaded && <>
      {isDefaultWall && <img className={styles.treshinaLeft} src={TreshinaLeft} alt="trishimna-right" />}
      {isDefaultWall && <img className={styles.treshinaRight} src={TreshinaRight} alt="treshina-left" />}

      <img className={styles.shelf} src={Shelf} alt="shelf" />
     {didIncreased && <img className={styles.coin} src={CoinIcon} alt="shelf" />}

      {achivementType && <img className={styles.reward} src={achivementType?.image} alt="reward" />}
      <Floor room={room ?? strangerRoom} />
      <button onClick={playCoin} style={{position: 'absolute', bottom: 0, zIndex: 10000000}}>Ghjbuhfnm</button>
    </>
}
    </div>
  );
};
