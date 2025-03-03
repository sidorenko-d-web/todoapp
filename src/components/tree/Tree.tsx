import { useEffect, useRef } from 'react';
import s from './Tree.module.scss';
import classNames from 'classnames';
import tickCircle from '../../assets/icons/tickCircle.svg';
import circle from '../../assets/icons/circle.svg';
import { useGetCurrentUserProfileInfoQuery, useGetTreeInfoQuery, useUnlockAchievementMutation } from '../../redux';
import { useTreeProgress } from '../../hooks';
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


export const Tree = () => {
  const { t, i18n } = useTranslation('tree');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { data: treeData } = useGetTreeInfoQuery();
  const { data: userProfileData } = useGetCurrentUserProfileInfoQuery();
  const progressBarContainerRef = useRef<HTMLDivElement | null>(null);
  const lastActiveLevelRef = useRef<HTMLDivElement | null>(null);

const [ unlockAchievement ] = useUnlockAchievementMutation();

  const userSubscribers = userProfileData?.subscribers || 0;

  const { progressPercent } = useTreeProgress({
    treeData,
    userSubscribers,
  });


  useEffect(() => {
    if (lastActiveLevelRef.current) {
      lastActiveLevelRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [progressPercent]);


  
  if (!treeData) {
    return null;
  }

  const handleUnlock = async (id: string) => {
    try {
      await unlockAchievement({ achievement_id: id }).unwrap();
      alert('Achievement unlocked!');
    } catch (err) {
      alert('Failed to unlock achievement.');
    }
  };

  return (
    <div className={s.container}>
      <div className={s.progressBarContainer}>
        <div className={s.progressBar} style={{ height: `${150 + (treeData.growth_tree_stages.length - 1) * 300}px` }}>
          <div
            className={s.progressFill}
            style={{ height: `${progressPercent}%` }}
            ref={progressBarContainerRef}
          />
          {treeData?.growth_tree_stages.map((stage, index) => {
            const isActive = userSubscribers >= stage.subscribers;
            const bottomPosition = 150 + index * 300;

            const giftColors = [giftBlue, giftPurple, giftRed];
            const spinnerColors = [spinnerBlue, spinnerPurple, spinnerRed];

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
                  stage.achievement.is_avaliable && 
                    <Button className={s.takeRewardBtn} onClick={() => handleUnlock(stage.achievement.id)}>Забрать</Button>
                }
                {stage.id > 1 && (
                  <div
                    className={classNames(s.prize, {
                      [s.priseSubscribers]: !stage.achievement,
                      [s.prizeRight]: index % 2 !== 1,
                    })}
                  >
                    {stage.achievement.is_avaliable
                     && <img className={s.imgPrizeActive} src={spinnerBlue} height={150} width={150} alt="spinner" />}
                    {stage.achievement && (
                      <div className={classNames(s.imgPrize,)}>
                        <div className={s.blickAnimation}>
                          <LazyLottie animationData={giftBlick}/>
                        </div>
                        <div className={classNames({ [s.blur]: !isActive })} />

                        <img src={giftIcon} height={20} width={20} alt="gift" style={{ opacity: '0.5' }} />


                        <div className={`${s.giftStatus} 
                          ${(stage.achievement.is_avaliable && !stage.achievement.is_unlocked)
                             || stage.achievement.is_unlocked? s.notTaken : ''}
                          ${(!stage.achievement.is_avaliable && !stage.achievement.is_unlocked)? s.notAchieved : ''}`} />
                      </div>
                    )}
                    <div className={classNames(s.text, { [s.textActive]: stage.achievement.is_avaliable })}>
                      <span className={`${(!stage.achievement.is_avaliable && !stage.achievement.is_unlocked)? s.inactive : ''}`}>
                        {formatAbbreviation(stage.subscribers, 'number', { locale: locale })} </span>
                      <span  className={`${(!stage.achievement.is_avaliable && !stage.achievement.is_unlocked) ? s.inactive : ''}`} 
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
    </div>
  );
};
