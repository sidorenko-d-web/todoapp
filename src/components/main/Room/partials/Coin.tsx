import styles from './Partials.module.scss';
import CoinIcon from '../../../../assets/icons/coin.png';
import { useState, useCallback, useEffect, } from 'react';
import { useIncrementingProfileStats } from '../../../../hooks/useIncrementingProfileStats';
import { useGetProfileMeQuery } from '../../../../redux';

interface props {
  isLoaded: boolean;
  strangerRoom: boolean;
}

export const Coin = ({ isLoaded, strangerRoom }: props) => {
  const [didIncreased, setDidIncreased] = useState(false);
  const { data } = useGetProfileMeQuery(undefined, {});

  // const { points: displayedPoints } = useIncrementingProfileStats({
  //   profileId: data?.id || '',
  //   basePoints: data?.points || '0',
  //   baseSubscribers: data?.subscribers || 0,
  //   baseTotalViews: data?.total_views || 0,
  //   baseTotalEarned: data?.total_earned || '0',
  //   futureStatistics: data?.future_statistics,
  //   lastUpdatedAt: data?.updated_at,
  // });


  const playCoin = useCallback(() => {
    console.log('callBack');
    if (didIncreased && isLoaded) return;
    setDidIncreased(true);
    setTimeout(() => {
      setDidIncreased(false);
    }, 1150);
  }, [didIncreased, isLoaded]);

  useEffect(() => {
    console.log('playCoin');
    playCoin();
  }, []);

  return didIncreased && !strangerRoom && <img className={styles.coin} src={CoinIcon} alt="shelf" />;
};
