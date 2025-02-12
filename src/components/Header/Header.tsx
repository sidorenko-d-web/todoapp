import styles from './Header.module.scss';
import CoinIcon from '../../assets/icons/coin.png';
import AvatarIcon from '../../assets/icons/new-avatar.svg';
import FireIcon from '../../assets/icons/avatar-fire.svg';
import SubscribersIcon from '../../assets/icons/subscribers.png';
import { RootState, useGetCurrentUserProfileInfoQuery, useGetTreeInfoQuery } from '../../redux';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setLastActiveStage } from '../../redux/slices/tree.ts';
import { formatAbbreviation } from '../../helpers';
import { useTranslation } from 'react-i18next';
import { TrackedLink } from '../';


export const Header = () => {
  const { data, isLoading, refetch } = useGetCurrentUserProfileInfoQuery();
  const { data: treeData } = useGetTreeInfoQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const points = useSelector((state: RootState) => state.pointSlice.points);
  const lastActiveStage = useSelector((state: RootState) => state.treeSlice.lastActiveStage);
  const { i18n } = useTranslation('profile');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

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
  }, [ lastActiveStageNumber, dispatch ]);

  useEffect(() => {
    refetch();
  }, [ points ]);

  const handleNavigateToProfile = () => {
    navigate(AppRoute.Profile);
  };

  const showCoins = useSelector((state: RootState) => state.guide.getCoinsGuideShown);

  return (
    <header className={styles.header}>
      <div className={styles.lowerHeader}>
        {isLoading && <p>Loading...</p>}

        <div className={styles.levelWrapper}>
          <div className={styles.avatarWrapper} onClick={handleNavigateToProfile}>
            <img className={styles.avatarIcon} src={AvatarIcon} alt="AvatarIcon" />
            <img className={styles.fireIcon} src={FireIcon} alt="FireIcon" />
          </div>

          <div className={styles.info}>
            <div className={styles.subscribers}>
              <p
                className={styles.subscribersNumber}>{formatAbbreviation(data?.subscribers || 0, 'number', { locale: locale })}</p>
              <img className={styles.subscribersIcon} src={SubscribersIcon} alt="SubscribersIcon" />
            </div>

            <div className={styles.levelInfo}>
              <TrackedLink
                trackingData={{
                  eventType: 'button',
                  eventPlace: 'В дерево роста - Хедер',
                }}
                to={AppRoute.ProgressTree} className={styles.levelNumber}>
                {lastActiveStage}
              </TrackedLink>
              <progress max={10} value={6} className={styles.levelProgressBar}></progress>
            </div>
          </div>
        </div>

        <div className={styles.coinsWrapper}>
          <p
            className={styles.coins}>{formatAbbreviation(showCoins ? (data?.points || 0) : '0', 'number', { locale: locale })}</p>
          <img className={styles.coinIcon} src={CoinIcon} alt="CoinIcon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
