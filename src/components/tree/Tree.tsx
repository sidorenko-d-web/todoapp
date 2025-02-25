import { useEffect, useRef } from 'react';
import s from './Tree.module.scss';
import classNames from 'classnames';
import tickCircle from '../../assets/icons/tickCircle.svg';
import circle from '../../assets/icons/circle.svg';
import { useGetCurrentUserProfileInfoQuery, useGetTreeInfoQuery } from '../../redux';
import { useTreeProgress } from '../../hooks';
import { formatAbbreviation } from '../../helpers';
import { useTranslation } from 'react-i18next';

import giftBlue from '../../assets/icons/gift.svg';
import giftPurple from '../../assets/icons/gift-purple.svg';
import giftRed from '../../assets/icons/gift-red.svg';

import questionBlue from '../../assets/icons/question-blue.svg';
import questionPurple from '../../assets/icons/question-purple.svg';
import questionRed from '../../assets/icons/question-red.svg';

import spinnerPurple from '../../assets/icons/purple-glow.svg';
import spinnerBlue from '../../assets/icons/blue-glow.svg';
import spinnerRed from '../../assets/icons/red-glow.svg';

import Lottie from 'lottie-react';
import { giftBlick } from '../../assets/animations';


export const Tree = () => {
  const { t, i18n } = useTranslation('tree');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { data: treeData } = useGetTreeInfoQuery();
  const { data: userProfileData } = useGetCurrentUserProfileInfoQuery();
  const progressBarContainerRef = useRef<HTMLDivElement | null>(null);
  const lastActiveLevelRef = useRef<HTMLDivElement | null>(null);



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
            const questionColors = [questionBlue, questionPurple, questionRed];
            const spinnerColors = [spinnerBlue, spinnerPurple, spinnerRed];

            const giftIcon = giftColors[index % giftColors.length];
            const questionIcon = questionColors[index % questionColors.length];
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
                {stage.id > 1 && (
                  <div
                    className={classNames(s.prize, {
                      [s.priseSubscribers]: !stage.achievement,
                      [s.prizeRight]: index % 2 !== 1,
                    })}
                  >
                    {stage.achievement && (
                      <div className={classNames(s.imgPrize, { [s.imgPrizeActive]: isActive })}>
                        <Lottie
                          animationData={giftBlick}
                          loop
                          autoplay
                          className={s.blickAnimation}
                        />
                        <div className={classNames({ [s.blur]: !isActive })} />
                        <img src={giftIcon} height={20} width={20} alt="gift" />
                        <div className={`${s.giftStatus} ${s.notAchieved}`}/>
                        {!isActive && <div className={classNames(s.questionWrapper)}>
                          <img src={questionIcon} className={s.question} height={16} width={16} alt="question" />
                        </div>}
                      </div>
                    )}
                    <div className={classNames(s.text, { [s.textActive]: isActive })}>
                      <span>{formatAbbreviation(stage.subscribers, 'number', { locale: locale })} </span>
                      <span style={{whiteSpace: 'normal'}}>{t('t1')}</span>
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
