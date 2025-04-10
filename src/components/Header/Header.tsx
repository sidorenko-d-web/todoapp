import styles from './Header.module.scss';
import CoinIcon from '../../assets/icons/coin.png';
import StreakAlarm from '../../assets/icons/streak-alarm.svg';
import FireBlue from '../../assets/icons/fire-blue.svg';
import FireGray from '../../assets/icons/fire-gray.svg';
import SubscribersIcon from '../../assets/icons/subscribers.png';
import { RootState, setLastActiveStage, useGetProfileMeQuery, useGetTreeInfoWithPollingQuery } from '../../redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppRoute, GUIDE_ITEMS, MODALS, PROFILE_ME_POLLING_INTERVAL, TREE_POLLING_INTERVAL } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { formatAbbreviation } from '../../helpers';
import { useTranslation } from 'react-i18next';
import { TrackedLink } from '../withTracking';
import { getOS, isGuideShown } from '../../utils';
import { useModal, usePushLineStatus } from '../../hooks';
import { useIncrementingProfileStats } from '../../hooks/useIncrementingProfileStats.ts';
import classNames from 'classnames';

export const Header = () => {
  const { data, isLoading, refetch } = useGetProfileMeQuery(undefined, {
    pollingInterval: PROFILE_ME_POLLING_INTERVAL,
  });

  const { subscribers: displayedSubscribers } = useIncrementingProfileStats({
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

  const subscribers = in_streak ? displayedSubscribers : data?.subscribers;

  const { data: treeData } = useGetTreeInfoWithPollingQuery(undefined, {
    pollingInterval: TREE_POLLING_INTERVAL,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: profile, refetch: refetchProfileData } = useGetProfileMeQuery();
  const lastActiveStageFromProfile = profile?.growth_tree_stage_id;
  const lastActiveStageFromState = useSelector((state: RootState) => state.treeSlice.lastActiveStage);

  const lastActiveStage = lastActiveStageFromState ?? lastActiveStageFromProfile;
  const { i18n } = useTranslation('profile');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const platform = getOS();

  const [ rerender, setRerender ] = useState(0);


  const { getModalState } = useModal();
  const { isOpen: isGetGiftModalOpen } = getModalState(MODALS.GET_GIFT);
  const { isOpen: integrationRewardModalOpen } = getModalState(MODALS.INTEGRATION_REWARD);
  const { isOpen: rewardModalOpen } = getModalState(MODALS.GET_REWARD);
  const { isOpen: taskCompletedModalOpen } = getModalState(MODALS.TASK_COMPLETED);  
  const { isOpen: taskChestModalOpen } = getModalState(MODALS.TASK_CHEST);
  const { isOpen: itemUpgradedModalOpen } = getModalState(MODALS.UPGRADED_ITEM);
  const { isOpen: newItemModalOpen } = getModalState(MODALS.NEW_ITEM);
  const { isOpen: dailyGiftModalOpen } = getModalState(MODALS.GET_GIFT_DAILY);

  useEffect(() => {
    if (
      isGetGiftModalOpen ||
      integrationRewardModalOpen ||
      rewardModalOpen ||
      taskCompletedModalOpen ||
      taskChestModalOpen ||
      itemUpgradedModalOpen ||
      newItemModalOpen ||
      dailyGiftModalOpen
    ) {
      refetchProfileData();
    }
  }, [
    isGetGiftModalOpen,
    integrationRewardModalOpen,
    rewardModalOpen,
    taskCompletedModalOpen,
    taskChestModalOpen,
    itemUpgradedModalOpen,
    newItemModalOpen,
    dailyGiftModalOpen
  ]);

  useEffect(() => {
    //needed to re-render header when gift modal closes to update the coin number
    if (isGetGiftModalOpen) {
      refetch();
    }
  }, [ isGetGiftModalOpen ]);

  const rerenderAfterPublish = useSelector((state: RootState) => state.guide.refetchAfterPublish);

  useEffect(() => {
    if (rerenderAfterPublish > rerender) {
      refetch().then(() => {
        setRerender(rerenderAfterPublish);
      });
    }
  }, [ rerenderAfterPublish ]);


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
  }, [ lastActiveStageNumber, dispatch ]);

  const handleNavigateToProfile = () => {
    if (footerActive) {
      navigate(AppRoute.Profile);
    }
  };

  const showCoins = useSelector((state: RootState) => state.guide.getCoinsGuideShown);
  const accelerateGuideShown = useSelector((state: RootState) => state.guide.accelerateIntegrationGuideClosed);
  const dim = useSelector((state: RootState) => state.guide.dimHeader);
  const integrationCurrentlyCreating = useSelector((state: RootState) => state.acceleration.integrationCreating);

  const currentStage = treeData?.growth_tree_stages.find(item => item.stage_number === profile?.growth_tree_stage_id);
  const nextStage = treeData?.growth_tree_stages.find(
    item => item.stage_number === (profile?.growth_tree_stage_id ?? 0) + 1,
  );

  const progressValue = useMemo(() => {
    if (currentStage?.stage_number === 450) {
      return 450;
    } else if (nextStage && profile && currentStage) {
      const gap = nextStage.subscribers - currentStage.subscribers;
      const subscribersInGap = profile?.subscribers - currentStage?.subscribers;

      return (subscribersInGap / gap) * 100;
    } else {
      return 0;
    }
  }, [profile?.growth_tree_stage_id, profile?.subscribers, treeData?.count]);
  


  const showHeaderBG =
    ![ '/', '/progressTree' ].includes(location) &&
    !(location.split('/')[1] === 'profile' && location.split('/')[3] === 'room');

  const darken =
    dim &&
    !getModalState(MODALS.SUBSCRIBE).isOpen &&
    !getModalState(MODALS.CREATING_INTEGRATION).isOpen &&
    !getModalState(MODALS.SUCCESSFULLY_SUBSCRIBED).isOpen;

  const darken2 =
    isGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE) &&
    !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_ACCELERATED_GUIDE_CLOSED);

  const darken3 =
    isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN) &&
    !isGuideShown(GUIDE_ITEMS.mainPage.SUBSCRIPTION_GUIDE_SHOWN);

  const notDarken = (integrationCurrentlyCreating && accelerateGuideShown) || getModalState(MODALS.SUBSCRIBE).isOpen;

  return (
    <>
      <header
        className={classNames(
          styles.header,
          { [styles.headerNot]: location === '/' || location === '/progressTree' },
          platform ? styles[platform] : '',
        )}
      >
        {(darken || darken2 || darken3) && !notDarken && (
          <div className={`${styles.headerOverlay} ${!in_streak ? styles.increaseOffset : ''}`}></div>
        )}

        {showHeaderBG && (
          <div className={`${styles.headerBG} ${(darken || darken2 || darken3) && !notDarken ? styles.darken : ''}`} />
        )}

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
                      {profile?.growth_tree_stage_id}
                    </TrackedLink>
                  ) : (
                    <span className={styles.levelNumber}>{lastActiveStage}</span>
                  )}
                  <progress max={100} value={progressValue} className={styles.levelProgressBar}></progress>
                </div>
              </div>
            </div>

            <div className={styles.coinsWrapper}>
              <p className={styles.coins}>
                {formatAbbreviation(showCoins ? data?.points || 0 : '0', 'number', { locale: locale })}
              </p>
              <img className={styles.coinIcon} src={CoinIcon} alt="CoinIcon" />
            </div>
          </div>
        )}
      </header>
    </>
  );
};
