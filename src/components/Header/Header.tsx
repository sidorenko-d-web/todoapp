import styles from './Header.module.scss';
import CoinIcon from '../../assets/icons/coin.png';
import StreakAlarm from '../../assets/icons/streak-alarm.svg';
import FireBlue from '../../assets/icons/fire-blue.svg';
import FireGray from '../../assets/icons/fire-gray.svg';
import SubscribersIcon from '../../assets/icons/subscribers.png';
import {
  RootState,
  setLastActiveStage,
  useGetProfileMeQuery,
  useGetProfileMeWithPollingQuery,
  useGetTreeInfoWithPollingQuery,
} from '../../redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppRoute, GUIDE_ITEMS, MODALS, PROFILE_ME_POLLING_INTERVAL, TREE_POLLING_INTERVAL } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { formatAbbreviation } from '../../helpers';
import { useTranslation } from 'react-i18next';
import { TrackedLink } from '../withTracking';
import { getOS, isGuideShown } from '../../utils';
import { useModal, usePushLineStatus } from '../../hooks';
import { useIncrementingProfileStats } from '../../hooks/useIncrementingProfileStats.ts';
import classNames from 'classnames';

export const Header = () => {
  const { data, isLoading, refetch } = useGetProfileMeWithPollingQuery(undefined, {
    pollingInterval: PROFILE_ME_POLLING_INTERVAL,
  });

  const { points: displayedPoints, subscribers: displayedSubscribers } = useIncrementingProfileStats({
    profileId: data?.id || '',
    basePoints: data?.points || '0',
    baseSubscribers: data?.subscribers || 0,
    baseTotalViews: data?.total_views || 0,
    baseTotalEarned: data?.total_earned || '0',
    futureStatistics: data?.future_statistics,
    lastUpdatedAt: data?.updated_at,
  });
  const location = useLocation().pathname;

  const { in_streak } = usePushLineStatus();

  const points = in_streak ? displayedPoints : data?.points;
  const subscribers = in_streak ? displayedSubscribers : data?.subscribers;

  const { data: treeData } = useGetTreeInfoWithPollingQuery(undefined, {
    pollingInterval: TREE_POLLING_INTERVAL,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: profile } = useGetProfileMeQuery();
  const lastActiveStageFromProfile = profile?.growth_tree_stage_id;
  const lastActiveStageFromState = useSelector((state: RootState) => state.treeSlice.lastActiveStage);

  const lastActiveStage = lastActiveStageFromState ?? lastActiveStageFromProfile;
  const { i18n } = useTranslation('profile');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const platform = getOS();

  const { getModalState } = useModal();
  const { isOpen } = getModalState(MODALS.GET_GIFT);

  useEffect(() => {
    //needed to re-render header when gift modal closes to update the coin number
    if (isOpen) {
      refetch();
    }
  }, [isOpen]);

  const footerActive = useSelector((state: RootState) => state.guide.footerActive);

  const userSubscribers = data?.subscribers || 0;
  let lastActiveStageNumber = 0;
  treeData?.growth_tree_stages.forEach(stage => {
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

  const dim = useSelector((state: RootState) => state.guide.dimHeader);

  const showHeaderBG =
    !['/', '/progressTree'].includes(location) &&
    !(location.split('/')[1] === 'profile' && location.split('/')[3] === 'room');

  const darken = (dim && !getModalState(MODALS.SUBSCRIBE).isOpen &&
    !getModalState(MODALS.CREATING_INTEGRATION).isOpen);

  const darken2 = isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE)
    && !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED);

  const darken3 = isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN) && !isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN);

  return (
    <>


      <header
        className={classNames(
          styles.header,
          { [styles.headerNot]: location === '/' || location === '/progressTree' },
          platform ? styles[platform] : '',
        )}
      >

        {(darken || darken2 || darken3) && <div className={styles.headerOverlay}></div>}


        {showHeaderBG && <div className={`${styles.headerBG} ${(darken || darken2 || darken3) ? styles.darken : ''}`} />}

        {!isLoading && (
          <div className={styles.lowerHeader}>
            <div className={styles.levelWrapper}>
              <div className={styles.avatarWrapper} onClick={handleNavigateToProfile}>
                <img className={styles.avatarIcon} src={in_streak ? FireBlue : FireGray} alt="AvatarIcon" />
                {!in_streak && <img className={styles.fireIcon} src={StreakAlarm} alt="FireIcon" />}
              </div>

              <div className={styles.info}>
                <div className={styles.subscribers}>
                  <p className={styles.subscribersNumber}>
                    {formatAbbreviation(subscribers || 0, 'number', { locale: locale })}
                  </p>
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
                    <span className={styles.levelNumber}>{lastActiveStage}</span>
                  )}
                  <progress max={10} value={6} className={styles.levelProgressBar}></progress>
                </div>
              </div>
            </div>

            <div className={styles.coinsWrapper}>
              <p className={styles.coins}>
                {formatAbbreviation(showCoins ? points || 0 : '0', 'number', { locale: locale })}
              </p>
              <img className={styles.coinIcon} src={CoinIcon} alt="CoinIcon" />
            </div>
          </div>
        )}
      </header>
    </>
  );
};
