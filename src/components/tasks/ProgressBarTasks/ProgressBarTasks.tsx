// ProgressBar.tsx
import React from 'react';
import s from './ProgressBarTasks.module.scss';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  progressReward?: string;
  progressRewardIcon?: string;
}

export const ProgressBarTasks: React.FC<ProgressBarProps> = ({
                                                          currentStep,
                                                          totalSteps,
                                                          progress,
                                                          progressReward,
                                                          progressRewardIcon,
                                                        }) => {
  return (
    <section className={s.progressBarSection}>
      <div className={s.progressBarSectionHeader}>
        <span>{currentStep}/{totalSteps}</span>
        <span className={s.progressReward}>
          {progressReward}
          {progressRewardIcon && <img src={progressRewardIcon} alt="reward" />}
        </span>
      </div>
      <div className={s.progressBar}>
        <div className={s.progressBarInner} style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
};