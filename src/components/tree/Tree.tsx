import { useRef, useEffect } from 'react';
import s from './Tree.module.scss';
import classNames from 'classnames';
import tickCircle from '../../assets/icons/tickCircle.svg';
import circle from '../../assets/icons/circle.svg';
import gift from '../../assets/icons/gift.svg';
import { useGetCurrentUserProfileInfoQuery, useGetTreeInfoQuery } from '../../redux';

let userLevel = 0;
let currentLevelSubscribers = 0;
let nextLevelSubscribers = 0;
let progressPercent = 0;

export const Tree = () => {
  const { data: treeData } = useGetTreeInfoQuery();
  const { data: userProfileData } = useGetCurrentUserProfileInfoQuery();

  const progressBarContainerRef = useRef<HTMLDivElement | null>(null);
  const lastActiveLevelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lastActiveLevelRef.current) {
      lastActiveLevelRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [progressPercent]);

  const userSubscribers = userProfileData?.subscribers || 0;
  const levelsCount = treeData?.growth_tree_stages.length || 0;

  const progressBarHeight = 150 + (levelsCount - 1) * 300;

  treeData?.growth_tree_stages.forEach((stage, index) => {
    if (userSubscribers >= stage.subscribers) {
      userLevel = index + 1;
      currentLevelSubscribers = stage.subscribers;
      nextLevelSubscribers = treeData?.growth_tree_stages[userLevel]?.subscribers || currentLevelSubscribers;
    }
  });

  if (currentLevelSubscribers && nextLevelSubscribers) {
    progressPercent = (currentLevelSubscribers * 100) / nextLevelSubscribers;
  }

  return (
    <div className={s.container}>
      <div className={s.progressBarContainer}>
        <div className={s.progressBar} style={{ height: `${progressBarHeight}px` }}>
          <div
            className={s.progressFill}
            style={{ height: `${progressPercent}%` }}
            ref={progressBarContainerRef}
          />
          {treeData?.growth_tree_stages.map((stage, index) => {
            const isActive = userSubscribers >= stage.subscribers;
            const bottomPosition = 150 + index * 300;

            return (
              <div key={stage.id} className={s.levelMarker} style={{ bottom: `${bottomPosition}px` }}>
                <div className={classNames(s.levelCircle, { [s.active]: isActive })}>
                  {isActive ? (
                    <img src={tickCircle} height={16} width={16} alt="tickCircle" />
                  ) : (
                    <img src={circle} height={16} width={16} alt="circle" />
                  )}
                  {stage.stage_number}
                </div>
                {stage.id > 1 && (
                  <div className={classNames(s.prize, {[s.priseSubscribers]: !stage.achievement}, {[s.prizeActive]: isActive})}>
                    {stage.achievement && (
                      <div className={classNames(s.imgPrize,{[s.imgPrizeActive]: isActive})}>
                        <div className={classNames({ [s.blur]: !isActive })} />
                        <img src={gift} height={20} width={20} alt="gift" />
                      </div>
                    )}
                    <p className={s.text}>{stage.subscribers} <br />
                      подписчиков</p>
                  </div>
                )}
                {isActive && (
                  <div ref={lastActiveLevelRef} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
