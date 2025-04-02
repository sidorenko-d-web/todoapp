import { CSSProperties, memo, useRef, useState } from 'react';
import s from './Tree.module.scss';
import tickCircle from '../../assets/icons/tickCircle.svg';
import circle from '../../assets/icons/circle.svg';
import question from '../../assets/icons/question.svg';
import {
  Boost,
  GrowthTreeStage,
  useGetProfileMeQuery,
  useGetTreeInfoQuery,
  useUnlockAchievementMutation,
} from '../../redux';

import giftBlue from '../../assets/icons/gift.svg';
import giftPurple from '../../assets/icons/gift-purple.svg';
import giftRed from '../../assets/icons/gift-red.svg';

import spinnerPurple from '../../assets/icons/purple-glow.svg';
import spinnerBlue from '../../assets/icons/blue-glow.svg';
import spinnerRed from '../../assets/icons/red-glow.svg';

import { giftBlick } from '../../assets/animations';
import LazyLottie from './LazyLottie';
import { useModal } from '../../hooks';
import { GUIDE_ITEMS, MODALS } from '../../constants';
import GetGift from '../../pages/DevModals/GetGift/GetGift';
import { Loader } from '../Loader';
import { useOutletContext } from 'react-router-dom';
import { useTreeProgress } from '../../hooks/useTreeProgress';
import { isGuideShown } from '../../utils';

import { FixedSizeList as List } from 'react-window';
import clsx from 'clsx';
import { Button } from '../shared';
import { formatAbbreviation } from '../../helpers';

export const Tree = () => {
  const { openModal } = useModal();
  // const { i18n } = useTranslation('tree');
  // const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { data: treeData, refetch } = useGetTreeInfoQuery();
  const { data: userProfileData } = useGetProfileMeQuery();
  const [currentBoost, setCurrentBoost] = useState<Boost | null>(null);
  const { isBgLoaded } = useOutletContext<{ isBgLoaded: boolean }>();
  console.log(userProfileData);
  const isGuide = !isGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW);

  const userSubscribers = userProfileData?.subscribers || 0;

  const progressBarContainerRef = useRef<HTMLDivElement | null>(null);

  const [unlockAchievement] = useUnlockAchievementMutation();
  const { progressPercent } = useTreeProgress({
    treeData,
    userSubscribers,
  });

  if (!treeData || !isBgLoaded || !userProfileData) {
    return (
      <>
        <div
          style={{ position: 'fixed', top: '0', left: '0', width: '100vh', height: '100vh', background: '#141319' }}
        />
        <Loader />
      </>
    );
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

  const Reward = memo(
    ({ isUnlocked, index, stage }: { isUnlocked: boolean; index: number; stage: GrowthTreeStage }) => {
      const isEven = index % 2 === 0;
      index === 4 && console.log(stage);

      const giftColors = [giftPurple, giftRed, giftBlue];

      const giftIcon = giftColors[index % giftColors.length];
      return (
        <div className={clsx(s.reward, !isEven && s.right)}>
          <div className={s.rewardsWrapper}>
            <div className={clsx(s.gift, !isUnlocked && s.inactive, isGuide && s.guide)}>
              <img className={s.upperImage} src={isUnlocked ? tickCircle : question} alt="" />
              <img className={s.giftImage} src={giftIcon} alt="" />
              <div className={s.blickAnimation}>
                <LazyLottie animationData={giftBlick} />
              </div>
            </div>
            {stage.achievement.image_url && (
              <div className={clsx(s.gift, !isUnlocked && s.inactive)}>
                <img className={s.giftImage} src={stage.achievement.image_url} alt="" />
                <div className={s.blickAnimation}>
                  <LazyLottie animationData={giftBlick} />
                </div>
              </div>
            )}

            {isUnlocked && stage.achievement.is_available && (
              <img
                className={clsx(s.rewardSpinner, stage.achievement.image_url && s.spinnerMoved)}
                src={spinnerBlue}
                height={150}
                width={150}
                alt="spinner"
              />
            )}
          </div>
          <div className={clsx(s.text, isGuide && s.guide)}>
            <span className={clsx(!isUnlocked && s.inactive)}>
              {formatAbbreviation(stage.subscribers)} <br /> подписчик{stage.subscribers === 1 ? '' : 'ов'}
            </span>
          </div>
        </div>
      );
    },
  );

  const Row = memo(({ index, style }: { index: number; style: CSSProperties }) => {
    const _index = 450 - index;
    const isStageCompleted = (userProfileData?.growth_tree_stage_id ?? 0) > _index;
    const isStageCurrentCompleted = userProfileData?.growth_tree_stage_id === _index;
    const stage = _index > 1 ? treeData?.growth_tree_stages[_index - 1] : undefined;

    const spinerColors = [spinnerRed, spinnerPurple, spinnerBlue];
    const spinner = Number.isInteger(index / 10) && spinerColors[index % spinerColors.length];

    return (
      <div className={clsx(s.container, index === 450 && s.startingRow, isGuide && s.guide)} style={style}>
        <div className={clsx(s.line, isStageCompleted && s.completed)}></div>
        <div className={clsx(s.badge, (isStageCompleted || isStageCurrentCompleted) && s.completed)}>
          <img src={isStageCompleted || isStageCurrentCompleted ? tickCircle : circle} />
          <p>{_index}</p>
        </div>
        {spinner && <img className={clsx(s.buttonSpinner)} src={spinner} height={150} width={150} alt="spinner" />}
        {stage?.achievement.is_available && !stage.achievement.is_unlocked && _index > 1 && (
          <Button
            className={clsx(s.takeRewardBtn)}
            onClick={() => handleUnlock(stage?.achievement.id ?? '', stage?.achievement.boost ?? {})}
          >
            Забрать
          </Button>
        )}

        {stage && <Reward isUnlocked={isStageCurrentCompleted || isStageCompleted} index={_index} stage={stage} />}
      </div>
    );
  });

  return (
    <div className={s.containerGlobal}>
      {!isGuide && (
        <div className={s.progressBarContainer}>
          <div
            className={s.progressBar}
            style={{ height: `${150 + (treeData ? (treeData.growth_tree_stages.length - 1) * 300 : 0) + 25}px` }}
          >
            <div className={s.progressFill} style={{ height: `${progressPercent}%` }} ref={progressBarContainerRef} />
          </div>
        </div>
      )}

      <div className={s.progressBarContainer}>
        <List
          initialScrollOffset={(449 - (userProfileData?.growth_tree_stage_id ?? 0)) * 330}
          className={s.list}
          height={window.screen.height}
          itemCount={451}
          itemSize={330}
          width={window.screen.width}
        >
          {Row}
        </List>
      </div>

      <GetGift boost={currentBoost} />
    </div>
  );
};
