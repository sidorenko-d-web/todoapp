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
import { useUpdateTaskMutation } from '../../../../redux/api/tasks/api';

interface ModalTopTasksProps {
  modalId: string;
  taskId: string;
  onClose: () => void;
  onStateChange?: (state: TaskState) => void;
  task: {
    title: string;
    description: string;
    stages: number;
    boost: {
      income_per_second: string;
      subscribers: number;
      views: number;
    };
    completed_stages: number;
    external_link: string;
  };
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
  taskId,
  onClose,
  onStateChange,
  task,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(task.completed_stages);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    Array(task.stages).fill(false).map((_, index) => index < task.completed_stages)
  );
  const [channelLink, setChannelLink] = useState('');
  const currentStepInfo = TASK_STEPS[currentStepIndex];
  const progress = (completedSteps.filter(step => step).length / task.stages) * 100;
  const [updateTask] = useUpdateTaskMutation();

  useEffect(() => {
    onStateChange?.({
      currentStep: completedSteps.filter(step => step).length,
      totalSteps: task.stages,
      completed: completedSteps.every(step => step),
    });
  }, [currentStepIndex, completedSteps]);

  const handleCompleteStep = async () => {
    try {
      const newCompletedSteps = [...completedSteps];
      newCompletedSteps[currentStepIndex] = true;
      setCompletedSteps(newCompletedSteps);

      await updateTask({
        id: taskId,
        data: {
          completed_stages: currentStepIndex + 1,
          link: channelLink,
        },
      });

      if (currentStepIndex === task.stages - 1) {
        onStateChange?.({
          currentStep: task.stages,
          totalSteps: task.stages,
          completed: true,
        });
        setTimeout(() => onClose(), 1000);
        return;
      }

      setCurrentStepIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <BottomModal
      modalId={modalId}
      title={task.title}
      onClose={onClose}
    >
      <div className={s.container}>
        <div className={s.rewards}>
          <span className={s.reward}>
            {task.boost.views}
            <img src={coinIcon} alt="coin" width={14} height={14} />
          </span>
          <span className={s.reward}>
            +{task.boost.income_per_second}
            <img src={coinIcon} alt="coin" width={14} height={14} />
            /сек.
          </span>
          <span className={s.reward}>
            {task.boost.subscribers}
            <img src={coinBlueIcon} alt="referral" width={14} height={14} />
          </span>
        </div>

        <div className={s.progress}>
          <span className={s.step}>
            Этап {currentStepIndex + 1}: {currentStepInfo.title}
          </span>
        </div>

        <div className={s.containerPG}>
          <ProgressBarTasks
            currentStep={currentStepIndex}
            totalSteps={task.stages}
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
          <h3 className={s.questionText}>{currentStepInfo.description}</h3>
        </div>

        <div className={s.buttons}>
          <a 
            href={task.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className={s.answerButton}
          >
            Инструкция
            <img src={bookIcon} alt="" className={s.buttonIcon} />
          </a>
          <button
            className={classNames(s.nextButton, {
              [s.active]: true,
            })}
            onClick={handleCompleteStep}
          >
            {currentStepIndex === task.stages - 1 ? 'Завершить' : 'Далее'}
          </button>
        </div>
      </div>
    </BottomModal>
  );
};