import React from 'react';
import subscribersIcon from '../../../assets/icons/subscribers.png';
import coinIcon from '../../../assets/icons/coin.png';
import circleIcon from '../../../assets/icons/circle-blue.svg';
import circleWhiteIcon from '../../../assets/icons/circle.svg';
import checkIcon from '../../../assets/icons/checkmark-in-the-circle.svg';
import giftIcon from '../../../assets/icons/gift.svg';
import { TaskBoost } from '../../../redux/api/tasks';

import s from './TaskCard.module.scss';
import { formatAbbreviation } from '../../../helpers';
import { ProgressBarTasks } from '../ProgressBarTasks';
import classNames from 'classnames';
import { TrackedButton } from '../..';
import { useTranslation } from 'react-i18next';
import Lottie from 'lottie-react';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import purpleLightAnimation from '../../../assets/animations/purpleLight.json';

type QuestionState = 'solved' | 'current' | 'closed';

type BaseTaskProps = {
  id?: string;
  title: string;
  description: string;
  icon?: string;
  showProgressBar?: boolean;
  progress?: number;
  currentStep?: number;
  totalSteps?: number;
  progressReward?: string;
  progressRewardIcon?: string;
  buttonText?: string;
  buttonType?: 'primary' | 'secondary';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  errorText?: string;
  isCompleted?: boolean;
  isRewardGiven?: boolean;
  isTopTask?: boolean;
  isDailyTask?: boolean;
  isSocialTask?: boolean;
  questionStates?: QuestionState[];
  boost?: TaskBoost;
};

type DefaultTaskProps = {
  type?: 'default';
  income: number;
  subscribers: number;
  passiveIncome: number;
};

type ProgressTaskProps = {
  type?: 'progress';
  income?: never;
  subscribers?: never;
  passiveIncome?: never;
};

type TasksCardProps = BaseTaskProps & (DefaultTaskProps | ProgressTaskProps);

export const TaskCard: React.FC<TasksCardProps> = ({
  id,
  title,
  description,
  icon,
  type = 'default',
  showProgressBar,
  income,
  subscribers,
  passiveIncome,
  currentStep,
  totalSteps,
  progress,
  progressReward,
  progressRewardIcon,
  buttonText,
  buttonType = 'primary',
  isLoading,
  disabled,
  onClick,
  questionStates = ['closed', 'closed', 'closed'],
  isCompleted,
  isRewardGiven,
  isTopTask,
  errorText,
  isDailyTask,
  isSocialTask,
}) => {
  const { t, i18n } = useTranslation('quests');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  // Устанавливаем значения по умолчанию с использованием перевода
  const defaultButtonText = buttonText || t('q13');
  const defaultErrorText = errorText || t('q32');

  // Функция для получения иконки на основе состояния
  const getIconByState = (state: QuestionState) => {
    if (isRewardGiven) {
      return checkIcon;
    }

    switch (state) {
      case 'solved':
        return checkIcon;
      case 'current':
        return circleWhiteIcon;
      case 'closed':
        return circleIcon;
    }
  };

  let animationLight;

  if (isTopTask) {
    animationLight = <Lottie animationData={purpleLightAnimation} loop={true} className={s.lightAnimation} />;
  } else if ((isDailyTask && buttonText !== t('q15')) || isSocialTask) {
    animationLight = <Lottie animationData={blueLightAnimation} loop={true} className={s.lightAnimation} />;
  }

  return (
    <div
      className={classNames(s.card, {
        [s.completed]: isCompleted,
        [s.topTask]: isTopTask,
        [s.dailyTask]: isDailyTask,
        [s.socialTask]: isSocialTask,
        [s.ru]: locale === 'ru',
        [s.en]: locale === 'en',
        [s.rewardGiven]: isRewardGiven,
      })}
    >
      {isCompleted && <div className={s.animationWrapper}>{animationLight}</div>}

      <section className={s.header}>
        {icon && <img className={classNames(s.icon, { [s.iconSocial]: isSocialTask })} src={icon} alt="icon" />}
        <div className={s.info}>
          <h2 className={s.title}>{title}</h2>
          <p className={s.description}>{description}</p>
        </div>
      </section>

      {type === 'default' && (
        <section className={s.rewards}>
          <span className={s.reward}>
            +{formatAbbreviation(income ?? 0, 'number', { locale: locale })}
            <img src={coinIcon} alt={t('q38')} />
          </span>
          <span className={s.reward}>
            +{formatAbbreviation(subscribers ?? 0, 'number', { locale: locale })}
            <img src={subscribersIcon} alt={t('q36')} />
          </span>
          <span className={s.reward}>
            +{formatAbbreviation(passiveIncome ?? 0, 'number', { locale: locale })}
            <img src={coinIcon} alt={t('q38')} />/{t('q39')}
          </span>
        </section>
      )}

      {type === 'progress' && (
        <section className={s.progressTypeSection}>
          <div className={s.progressTypeSteps}>
            {questionStates.map((state, index) => (
              <img key={index} src={getIconByState(state)} height={18} width={18} alt={`step-${state}`} />
            ))}
          </div>
          <div className={s.progressTypeReward}>
            <span className={s.reward}>
              {'10 - 1000'} <img src={coinIcon} height={18} width={18} alt={t('q38')} />
            </span>
            <span className={s.reward}>
              <img src={giftIcon} height={18} width={18} alt={t('q34')} />
            </span>
          </div>
        </section>
      )}

      {showProgressBar && (
        <ProgressBarTasks
          currentStep={currentStep ?? 0}
          totalSteps={totalSteps ?? 0}
          progress={progress ?? 0}
          progressReward={progressReward}
          progressRewardIcon={progressRewardIcon}
        />
      )}

      {errorText && <div className={s.errorText}>{defaultErrorText}</div>}

      <section className={s.buttons}>
        {/* {isCompleted && <div className={s.images}>{animationLight}</div>} */}
        <TrackedButton
          trackingData={{
            eventType: 'button',
            eventPlace: `${defaultButtonText} - ${t('q1')} - ${title}`,
          }}
          className={`${s.button} ${s[buttonType]} ${isLoading ? s.loading : ''}`}
          disabled={disabled || isLoading}
          onClick={() => {
            localStorage.setItem('taskId', '' + id);
            onClick?.();
          }}
        >
          {isLoading ? (
            <>
              {defaultButtonText}
              <span className={s.loadingDots}>...</span>
            </>
          ) : (
            defaultButtonText
          )}
        </TrackedButton>
      </section>
    </div>
  );
};
