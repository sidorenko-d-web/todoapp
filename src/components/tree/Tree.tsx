import { useEffect, useRef, useState } from 'react';
import s from './Tree.module.scss';
import classNames from 'classnames';
import tickCircle from '../../assets/icons/tickCircle.svg';
import circle from '../../assets/icons/circle.svg';
import shop from '../../assets/icons/colored-shop.svg';
import {
  Boost,
  useGetCurrentUserProfileInfoQuery,
  useGetTreeInfoQuery,
  useUnlockAchievementMutation,
} from '../../redux';
import { formatAbbreviation } from '../../helpers';
import { useTranslation } from 'react-i18next';

import giftBlue from '../../assets/icons/gift.svg';
import giftPurple from '../../assets/icons/gift-purple.svg';
import giftRed from '../../assets/icons/gift-red.svg';

import spinnerPurple from '../../assets/icons/purple-glow.svg';
import spinnerBlue from '../../assets/icons/blue-glow.svg';
import spinnerRed from '../../assets/icons/red-glow.svg';

import { giftBlick } from '../../assets/animations';
import { Button } from '../shared';
import LazyLottie from './LazyLottie';
import { useModal } from '../../hooks';
import { MODALS } from '../../constants';
import GetGift from '../../pages/DevModals/GetGift/GetGift';
import { Loader } from '../Loader';
import { useOutletContext } from 'react-router-dom';

type ShopUpgrades = {
  [key: string]: { icon: string };
}

const shopUpgrades: ShopUpgrades = {
  150: { icon: s.arrowsPurple },
  300: { icon: s.arrowsRed },
};

export const Tree = () => {
  const { openModal } = useModal();
  const { t, i18n } = useTranslation('tree');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { data: treeData, refetch } = useGetTreeInfoQuery();
  const { data: userProfileData } = useGetCurrentUserProfileInfoQuery();
  const lastActiveLevelRef = useRef<HTMLDivElement | null>(null);
  const [ currentBoost, setCurrentBoost ] = useState<Boost | null>(null);
  const { isBgLoaded } = useOutletContext<{ isBgLoaded: boolean }>();

  const [ unlockAchievement ] = useUnlockAchievementMutation();

  useEffect(() => {
    if (lastActiveLevelRef.current) {
      lastActiveLevelRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, []);

  if (!treeData || !isBgLoaded) {
    return <Loader />;
  }

  const handleUnlock = async (id: string, boost: Boost) => {
    try {
      await unlockAchievement({ achievement_id: id }).unwrap();
      setCurrentBoost(boost);
      openModal(MODALS.GET_GIFT);
      refetch();
    } catch (err) {
      alert('Failed to unlock achievement.');
    }
  };

  return (
    <div className={s.container}>
      <div className={s.progressBarContainer}>
        <div className={s.progressBar} style={{ height: `${150 + (treeData.growth_tree_stages.length - 1) * 300}px` }}>
          {treeData?.growth_tree_stages.map((stage, index) => {
            const isRewardAvailable = stage.achievement.is_available;
            // const isRewardAvailable = true;
            const isRewardClaimed = stage.achievement.is_unlocked;
            // const isRewardClaimed = true;
            const showReward = stage.achievement.boost.subscribers > 0; // Не показываем первый элемент, тк награды в нем нулевые

            const isActive = userProfileData && stage.id <= userProfileData.growth_tree_stage_id;
            const bottomPosition = 150 + index * 300;

            const giftColors = [ giftBlue, giftPurple, giftRed ];
            const spinnerColors = [ spinnerBlue, spinnerPurple, spinnerRed ];

            const giftIcon = giftColors[index % giftColors.length];
            const spinnerIcon = spinnerColors[index % spinnerColors.length];

            return (
              <div key={stage.id} className={s.levelMarker} style={{ bottom: `${bottomPosition}px` }}>
                <div className={classNames(s.levelCircle, { [s.active]: isActive })}>
                  {isActive ? (
                    <img src={tickCircle} height={16} width={16} alt="tickCircle" style={{ zIndex: '0' }} />
                  ) : (
                    <img src={circle} height={16} width={16} alt="circle" style={{ zIndex: '0' }} />
                  )}
                  {stage.stage_number}
                  {stage.stage_number % 10 === 0 && (
                    <img className={s.spiner} src={spinnerIcon} height={120} width={120} alt="spinner" />
                  )}
                </div>

                {
                  isRewardAvailable && !isRewardClaimed && showReward &&
                  <Button className={s.takeRewardBtn}
                          onClick={() => handleUnlock(stage.achievement.id, stage.achievement.boost)}>Забрать</Button>
                }
                {showReward && (
                  <div
                    className={classNames(s.prize, {
                      [s.priseSubscribers]: !stage.achievement,
                      [s.prizeRight]: index % 2 !== 1,
                    })}
                  >
                    <div className={s.rewardsIconsWrapper}>
                      {/* Блок с подарком */}
                      {stage.achievement && (
                        <div className={classNames(s.imgPrize)}>
                          {!isRewardClaimed && (
                            <>
                              <div className={s.blickAnimation}>
                                <LazyLottie animationData={giftBlick} />
                              </div>
                              <div className={classNames({ [s.blur]: !isActive })} />
                            </>
                          )}

                          <img src={giftIcon} height={20} width={20} alt="gift" />

                          <div className={`${s.giftStatus} 
                          ${(isRewardAvailable && !isRewardClaimed)
                          || isRewardClaimed ? s.notTaken : ''}
                          ${(!isRewardAvailable && !isRewardClaimed) ? s.notAchieved : ''}`} />

                          {isRewardAvailable && !isRewardClaimed &&
                            <img className={s.imgPrizeActive} src={spinnerBlue} height={150} width={150}
                                 alt="spinner" />
                          }
                        </div>
                      )}

                      {/* Блок с доп наградой */}
                      {stage.achievement.image_url && (
                        <div className={s.imgPrize}>
                          {!isRewardClaimed && (
                            <>
                              <div className={s.blickAnimation}>
                                <LazyLottie animationData={giftBlick} />
                              </div>
                              <div className={classNames({ [s.blur]: !isActive })} />
                            </>
                          )}

                          <img src={stage.achievement.image_url} height={20} width={20} alt="reward" />

                          {(isRewardAvailable && !isRewardClaimed) || isRewardClaimed && <div
                            className={`${s.giftStatus} ${s.notTaken}`}
                          />}
                        </div>
                      )}

                      {/* Блок с улучшением магазина */}
                      {Object.keys(shopUpgrades).includes(stage.stage_number.toString()) && (
                        <div className={s.imgPrize}>
                          {!isRewardClaimed && (
                            <>
                              <div className={s.blickAnimation}>
                                <LazyLottie animationData={giftBlick} />
                              </div>
                              <div className={classNames({ [s.blur]: !isActive })} />
                            </>
                          )}

                          <img src={shop} height={20} width={20} alt="reward" />

                          <div
                            className={`${s.giftStatus} ${shopUpgrades[stage.stage_number].icon}`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Блок с кол-вом подписчиков  */}
                    <div className={classNames(s.text, { [s.textActive]: isRewardAvailable })}>
                      <span
                        className={`${(!isRewardAvailable && !isRewardClaimed) ? s.inactive : ''}`}>
                        {formatAbbreviation(stage.subscribers, 'number', { locale: locale })} </span>
                      <span
                        className={`${(!isRewardAvailable && !isRewardClaimed) ? s.inactive : ''}`}
                        style={{ whiteSpace: 'normal' }}>{t('t1')}</span>
                    </div>
                  </div>
                )}
                {isActive && <div ref={lastActiveLevelRef} />}
              </div>
            );
          })}
        </div>
      </div>

      <GetGift boost={currentBoost} />
    </div>
  );
};
