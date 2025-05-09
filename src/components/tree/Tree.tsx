import { CSSProperties, memo, useEffect } from 'react';
import s from './Tree.module.scss';
import tickCircle from '../../assets/icons/tickCircle.svg';
import circle from '../../assets/icons/circle.svg';
import question from '../../assets/icons/question.svg';
import { GrowthTreeStage, useGetProfileMeQuery, useGetTreeInfoQuery, useUnlockAchievementMutation } from '../../redux';

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
import { isGuideShown } from '../../utils';

import { FixedSizeList as List } from 'react-window';
import clsx from 'clsx';
import { Button } from '../shared';
import { formatAbbreviation } from '../../helpers';
import { useTranslation } from 'react-i18next';
import { WithModal } from '../shared/WithModal/WithModa';

export const Tree = () => {
  const { openModal } = useModal();
  const { t, i18n } = useTranslation('tree');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { data: treeData, refetch } = useGetTreeInfoQuery();
  const { data: userProfileData, isLoading } = useGetProfileMeQuery();
  const { isBgLoaded } = useOutletContext<{ isBgLoaded: boolean }>();
  const isGuide = !isGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW);
  // const [currentUserLevel, setCurrentUserLevel] = useState(0);

  useEffect(() => {
    if (userProfileData && !isLoading) {
      // setCurrentUserLevel(userProfileData.growth_tree_stage_id);
      localStorage.setItem('USER_LEVEL', '' + userProfileData.growth_tree_stage_id);
    }
  }, [userProfileData, isLoading]);

  const [unlockAchievement] = useUnlockAchievementMutation();

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

  const handleUnlock = async (id: string, stageNumber: number) => {
    const gifts = {
      ru: {
        blueGift: 'Синий подарок',
        purpleGift: 'Фиолетовый подарок',
        redGift: 'Красный подарок',
      },
      en: {
        blueGift: 'Blue Gift',
        purpleGift: 'Purple Gift',
        redGift: 'Red Gift',
      },
    };

    const giftColors = ['purpleGift', 'redGift', 'blueGift'];
    const currentGift = giftColors[stageNumber % giftColors.length];
    const localed = gifts[locale];
    const boost = treeData?.growth_tree_stages?.[stageNumber - 1]?.achievement.boost;
    const boostPrev =
      stageNumber > 1 && stageNumber === parseInt(localStorage.getItem('USER_LEVEL') || '1')
        ? treeData?.growth_tree_stages?.[stageNumber - 2]?.achievement.boost
        : null;

    localStorage.setItem('STAGE_NUMBER', '' + stageNumber);
    localStorage.setItem('GIFT_FOR_TREE_STAGE', '1');

    try {
      await unlockAchievement({ achievement_id: id }).unwrap();
      await refetch();
      openModal(MODALS.GET_GIFT, { giftColor: localed[currentGift as keyof typeof localed], boost, boostPrev });
    } catch (err) {
      alert('Failed to unlock achievement.');
    }
  };

  const Reward = memo(
    ({ isUnlocked, index, stage }: { isUnlocked: boolean; index: number; stage: GrowthTreeStage }) => {
      const isEven = index % 2 === 0;

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
              {formatAbbreviation(stage.subscribers)} <br /> {t('t1')}
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
            onClick={() => handleUnlock(stage?.achievement.id ?? '', stage?.stage_number ?? 0)}
          >
            {t('t2')}
          </Button>
        )}

        {stage && <Reward isUnlocked={isStageCurrentCompleted || isStageCompleted} index={_index} stage={stage} />}
      </div>
    );
  });

  return (
    <div className={s.containerGlobal}>
      {!isGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW) && (
        <>
          <div
            style={{
              position: 'fixed',
              bottom: '85px',
              left: '0',
              width: '100vh',
              height: '30px',
              backgroundColor: 'rgba(0, 0, 0, 0.91)',
            }}
          />

          <div
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100vh',
              height: '165px',
              backgroundColor: 'rgba(0, 0, 0, 0.91)',
            }}
          />
        </>
      )}

      <div className={s.progressBarContainer}>
        <List
          initialScrollOffset={(449 - (userProfileData?.growth_tree_stage_id ?? 0)) * 330 + 250}
          className={s.list}
          height={window.screen.height}
          itemCount={451}
          itemSize={330}
          width={window.screen.width}
        >
          {Row}
        </List>
      </div>

      <WithModal modalId={MODALS.GET_GIFT} component={<GetGift />} />
    </div>
  );
};
