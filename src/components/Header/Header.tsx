import styles from './Header.module.scss';
import CoinIcon from '../../assets/icons/coin.png';
import AvatarIcon from '../../assets/icons/person.svg';
import FireIcon from '../../assets/icons/avatar-fire.svg';
import SubscribersIcon from '../../assets/icons/subscribers.png';
import { RootState, setLastActiveStage, useGetCurrentUserProfileInfoQuery, useGetTreeInfoQuery } from '../../redux';
import { useNavigate } from 'react-router-dom';
import { AppRoute, MODALS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { formatAbbreviation } from '../../helpers';
import { useTranslation } from 'react-i18next';
import { TrackedLink } from '../withTracking';
import { getOS } from '../../utils';
import { useModal } from '../../hooks';
import { useIncrementingProfileStats } from '../../hooks/useIncrementingProfileStats.ts';

export const Header = () => {
  const { data, isLoading, refetch } = useGetCurrentUserProfileInfoQuery(undefined, {
    pollingInterval: 10000, // 10 сек
  });

  const { totalEarned, subscribers } = useIncrementingProfileStats({
    profileId: data?.id || "",
    basePoints: data?.points || "0",
    baseSubscribers: data?.subscribers || 0,
    baseTotalViews: data?.total_views || 0,
    baseTotalEarned: data?.total_earned || "0",
    futureStatistics: data?.future_statistics,
    lastUpdatedAt: data?.updated_at
  })

  const { data: treeData } = useGetTreeInfoQuery(undefined, {
    pollingInterval: 10000, // 10 сек
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lastActiveStage = useSelector((state: RootState) => state.treeSlice.lastActiveStage);
  const { i18n } = useTranslation('profile');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const platform = getOS();

  const { getModalState } = useModal();
  const { isOpen } = getModalState(MODALS.GET_GIFT);

  useEffect(() => {
    //needed to re-render header when gift modal closes to update the coin number
    if (isOpen) {
      refetch().then(() => {
        console.log('update ' + data?.points);

      });
    }
  }, [isOpen]);

  const footerActive = useSelector((state: RootState) => state.guide.footerActive);

  const userSubscribers = data?.subscribers || 0;
  let lastActiveStageNumber = 0;
  treeData?.growth_tree_stages.forEach((stage) => {
    if (userSubscribers >= stage.subscribers) {
      lastActiveStageNumber = Number(stage.stage_number);
    }
  });

  useEffect(() => {
    if (lastActiveStageNumber) {
      dispatch(setLastActiveStage(lastActiveStageNumber));
    }
  }, [lastActiveStageNumber, dispatch]);

  const handleNavigateToProfile = () => {
    if (footerActive) {
      navigate(AppRoute.Profile);
    }
  };

  const showCoins = useSelector((state: RootState) => state.guide.getCoinsGuideShown);

  return (
    <header className={`${styles.header} ${platform ? styles[platform] : ''}`}>
      {isLoading ? <p>Loading...</p> :
        <div className={styles.lowerHeader}>
          <div className={styles.levelWrapper}>
            <div className={styles.avatarWrapper} onClick={handleNavigateToProfile}>
              <img className={styles.avatarIcon} src={AvatarIcon} alt="AvatarIcon" />
              <img className={styles.fireIcon} src={FireIcon} alt="FireIcon" />
            </div>

            <div className={styles.info}>
              <div className={styles.subscribers}>
                <p
                  className={styles.subscribersNumber}>{formatAbbreviation(subscribers || 0, 'number', { locale: locale })}</p>
                <img className={styles.subscribersIcon} src={SubscribersIcon} alt="SubscribersIcon" />
              </div>

              <div className={styles.levelInfo}>
                {footerActive ? (
                  <TrackedLink
                    trackingData={{
                      eventType: 'button',
                      eventPlace: 'В дерево роста - Хедер',
                    }}
                    to={AppRoute.ProgressTree}
                    className={styles.levelNumber}
                  >
                    {lastActiveStage}
                  </TrackedLink>
                ) : (
                  <span className={styles.levelNumber}>
                    {lastActiveStage}
                  </span>
                )}
                <progress max={10} value={6} className={styles.levelProgressBar}></progress>
              </div>
            </div>
          </div>

          <div className={styles.coinsWrapper}>
            <p
              className={styles.coins}>{formatAbbreviation(showCoins ? (totalEarned || 0) : '0', 'number', { locale: locale })}</p>
            <img className={styles.coinIcon} src={CoinIcon} alt="CoinIcon" />
          </div>
        </div>
      }
    </header>
  );
};

export default Header;
