import { FC, useEffect, useState } from 'react';
import coinIcon from '../../../../assets/icons/coin.png';
import classNames from 'classnames';
import s from './ModalTopTasks.module.scss';
import BottomModal from '../../../shared/BottomModal/BottomModal';

import dotsIcon from '../../../../assets/icons/dots.svg';
import checkIcon from '../../../../assets/icons/checkmark-in-the-circle.svg';
import bookIcon from '../../../../assets/icons/book.svg';
import coinBlueIcon from '../../../../assets/icons/coin-blue-human.svg';
import { ProgressBarTasks } from '../../ProgressBarTasks';
import chestIcon from '../../../../assets/icons/chest-purple.svg';

interface ModalTopTasksProps {
  modalId: string;
  onClose: () => void;
  onStateChange?: (state: TaskState) => void;
}

interface TaskStep {
  id: number;
  title: string;
  description: string;
  reward: number;
}

interface TaskState {
  currentStep: number;
  totalSteps: number;
  completed: boolean;
}

const TASK_STEPS: TaskStep[] = [
  {
    id: 1,
    title: 'Создание канала',
    description: 'Вам нужно создать свой личный канал в телеграмме. Прочитайте наш подробный гайд, и прикрепите ссылку ниже. Последующие этапы будут завязаны на вашем канале.',
    reward: 25,
  },
  {
    id: 2,
    title: 'Настройка профиля',
    description: 'Добавьте аватар и описание канала',
    reward: 35,
  },
  {
    id: 3,
    title: 'Первый пост',
    description: 'Опубликуйте ваш первый пост в канале',
    reward: 40,
  },
  {
    id: 4,
    title: 'Привлечение подписчиков',
    description: 'Получите первых 10 подписчиков',
    reward: 50,
  },
];

export const ModalTopTasks: FC<ModalTopTasksProps> = ({
                                                        modalId,
                                                        onClose,
                                                        onStateChange,
                                                      }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    Array(TASK_STEPS.length).fill(false),
  );
  const [channelLink, setChannelLink] = useState('');

  const currentStep = TASK_STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / TASK_STEPS.length) * 100;

  useEffect(() => {
    onStateChange?.({
      currentStep: currentStepIndex + 1,
      totalSteps: TASK_STEPS.length,
      completed: completedSteps.every(step => step),
    });
  }, [currentStepIndex, completedSteps]);

  const handleCompleteStep = () => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[currentStepIndex] = true;
    setCompletedSteps(newCompletedSteps);

    if (currentStepIndex === TASK_STEPS.length - 1) {
      setTimeout(() => onClose(), 1000);
      return;
    }

    setCurrentStepIndex(prev => prev + 1);
  };

  return (
    <BottomModal
      modalId={modalId}
      title="Создание личного канала"
      onClose={onClose}
    >
      <div className={s.container}>
        <div className={s.rewards}>
          <span className={s.reward}>
            200
            <img src={coinIcon} alt="coin" width={14} height={14} />
          </span>
          <span className={s.reward}>
            +10
            <img src={coinIcon} alt="coin" width={14} height={14} />
            /сек.
          </span>
          <span className={s.reward}>
            100
            <img src={coinBlueIcon} alt="referral" width={14} height={14} />
          </span>
        </div>

        <div className={s.progress}>
          <span className={s.step}>
            Этап {currentStepIndex + 1}: {currentStep.title}
          </span>
        </div>

        <div className={s.containerPG}>
          <ProgressBarTasks
            currentStep={currentStepIndex + 1}
            totalSteps={TASK_STEPS.length}
            progress={progress}
            progressReward="Драгоценный сундук"
            progressRewardIcon={chestIcon}
          />
        </div>


        <div className={s.question}>
          <span className={s.linkLabel}>Ссылка на канал</span>
          <div className={s.options}>
            <div className={s.option}>
              <input
                type="text"
                className={s.channelInput}
                value={channelLink}
                onChange={(e) => setChannelLink(e.target.value)}
                placeholder="Введите ссылку на канал"
              />
              <div className={s.selectWrapper}>
                <img
                  src={completedSteps[currentStepIndex] ? checkIcon : dotsIcon}
                  className={s.icon}
                  alt=""
                />
              </div>
            </div>
          </div>
          <h3 className={s.questionText}>{currentStep.description}</h3>
        </div>

        <div className={s.buttons}>
          <button className={s.answerButton}>
            Инструкция
            <img src={bookIcon} alt="" className={s.buttonIcon} />
          </button>
          <button
            className={classNames(s.nextButton, {
              [s.active]: true,
            })}
            onClick={handleCompleteStep}
          >
            {currentStepIndex === TASK_STEPS.length - 1 ? 'Завершить' : 'Далее'}
          </button>
        </div>
      </div>
    </BottomModal>
  );
};