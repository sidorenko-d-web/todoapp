import React from 'react';
import subscribersIcon from '../../../assets/icons/subscribers.svg';
import coinIcon from '../../../assets/icons/coin.svg';
import circleIcon from '../../../assets/icons/circle.svg';
import giftIcon from '../../../assets/icons/gift.svg';

import s from './TaskCard.module.scss';

type BaseTaskProps = {
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
};

type DefaultTaskProps = {
  type?: 'default';
  income: number; // Желтые монеты
  subscribers: number; // Синие монеты
  passiveIncome: number; // Желтые монеты / сек
};

type ProgressTaskProps = {
  type?: 'progress';
  income?: never; // Желтые монеты
  subscribers?: never; // Синие монеты
  passiveIncome?: never; // Желтые монеты / сек
};

type TasksCardProps = BaseTaskProps & (DefaultTaskProps | ProgressTaskProps);


export const TaskCard: React.FC<TasksCardProps> = ({
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
                                                     buttonText = 'Выполнить',
                                                     buttonType = 'primary',
                                                     isLoading,
                                                     disabled,
                                                     onClick,
                                                   }) => {
  return (
    <div className={s.card}>
      <section className={s.header}>
        {icon && <img className={s.icon} src={icon} height={40} width={40} alt={'icon'} />}
        <div className={s.info}>
          <h2 className={s.title}>{title}</h2>
          <p className={s.description}>{description}</p>
        </div>
      </section>

      {type === 'default' && (
        <section className={s.rewards}>
          <span className={s.reward}>+{income}<img src={coinIcon} height={14} width={14} alt={'income'} /></span>
          <span className={s.reward}>+{subscribers}<img src={subscribersIcon} height={14} width={14}
                                                        alt={'subscribers'} /></span>
          <span className={s.reward}>+{passiveIncome}<img src={coinIcon} height={14} width={14}
                                                          alt={'passive income'} />/сек.</span>
        </section>
      )}
      {type === 'progress' && (
        <section className={s.progressTypeSection}>
          <div className={s.progressTypeSteps}>
            <img src={circleIcon} height={18} width={18} alt={'step'}/>
            <img src={circleIcon} height={18} width={18} alt={'step'}/>
            <img src={circleIcon} height={18} width={18} alt={'step'}/>
          </div>
          <div className={s.progressTypeReward}>
            <span className={s.reward}>10 - 1000 <img src={coinIcon} height={14} width={14} alt={'income'} /></span>
            <span className={s.reward}>??? <img src={giftIcon} height={14} width={14} alt={'gift'} /></span>
          </div>
        </section>
      )}

      {showProgressBar && (
        <section className={s.progressBarSection}>
          <div className={s.progressBarSectionHeader}>
            <span>{currentStep}/{totalSteps}</span>
            <span className={s.progressReward}>{progressReward}{progressRewardIcon &&
              <img src={progressRewardIcon} height={12} width={12} alt={'reward'} />}</span>
          </div>
          <div className={s.progressBar}>
            <div className={s.progressBarInner} style={{ width: `${progress}%` }} />
          </div>
        </section>
      )}

      <section className={s.buttons}>
        <button
          className={s.button + ' ' + s[buttonType] + ' ' + (isLoading ? s.loading : '')}
          disabled={disabled || isLoading}
          onClick={onClick}
        >
          {buttonText}
        </button>
      </section>
    </div>
  );
};