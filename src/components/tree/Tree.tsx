import { useEffect, useRef } from 'react';
import s from './Tree.module.scss';
import classNames from 'classnames';
import tickCircle from '../../assets/icons/tickCircle.svg';
import circle from '../../assets/icons/circle.svg';
import gift from '../../assets/icons/gift.svg';
import spinner from '../../assets/icons/spinner-blue.svg';
import { RootState, useGetCurrentUserProfileInfoQuery, useGetTreeInfoQuery } from '../../redux';
import { useTreeProgress } from '../../hooks';
import { formatAbbreviation } from '../../helpers';
import { useSelector } from 'react-redux';

export const Tree = () => {
  const { data: treeData } = useGetTreeInfoQuery();
  const { data: userProfileData } = useGetCurrentUserProfileInfoQuery();
  const progressBarContainerRef = useRef<HTMLDivElement | null>(null);
  const lastActiveLevelRef = useRef<HTMLDivElement | null>(null);

  const hightlightTreeLevelStats = useSelector((state: RootState) => state.guide.hightlightTreeLevelStats);


  const userSubscribers = userProfileData?.subscribers || 0;

  const { progressPercent } = useTreeProgress({
    treeData,
    userSubscribers
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

            return (
              <div key={stage.id} className={s.levelMarker} style={{ bottom: `${bottomPosition}px` }}>
                <div className={classNames(s.levelCircle, { [s.active]: isActive })}>
                  {isActive ? (
                    <img src={tickCircle} height={16} width={16} alt="tickCircle" style={{zIndex: '0'}}/>
                  ) : (
                    <img src={circle} height={16} width={16} alt="circle" style={{zIndex: '0'}}/>
                  )}
                  {stage.stage_number}
                </div>
                {stage.id > 1 && (
                  <div
                    className={classNames(s.prize, {
                      [s.priseSubscribers]: !stage.achievement,
                      [s.prizeActive]: isActive || stage.stage_number % 10 === 0,
                      [s.highlight] : hightlightTreeLevelStats,
                    })}
                  >
                    {stage.stage_number % 10 === 0 && (
                      <img className={s.spiner} src={spinner} height={120} width={120} alt="spinner"/>
                    )}
                    {stage.achievement && (
                      <div className={classNames(s.imgPrize, { [s.imgPrizeActive]: isActive, [s.highlight] : hightlightTreeLevelStats })}>
                        <div className={classNames({ [s.blur]: !isActive })} />
                        <img src={gift} height={20} width={20} alt="gift" />
                      </div>
                    )}
                    <p className={classNames(s.text, { [s.textActive]: isActive})}>
                      {formatAbbreviation(stage.subscribers)} <br />
                      подписчиков
                    </p>
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
