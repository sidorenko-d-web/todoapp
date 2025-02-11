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

interface TaskState {
  currentStep: number;
  totalSteps: number;
  completed: boolean;
}

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
  const progress = (completedSteps.filter(step => step).length / task.stages) * 100;
  const [updateTask] = useUpdateTaskMutation();

  useEffect(() => {
    setCurrentStepIndex(task.completed_stages);
    setCompletedSteps(
      Array(task.stages)
        .fill(false)
        .map((_, index) => index < task.completed_stages)
    );
  }, [task.completed_stages, task.stages]);

  useEffect(() => {
    onStateChange?.({
      currentStep: task.completed_stages,
      totalSteps: task.stages,
      completed: task.completed_stages === task.stages,
    });
  }, [task.completed_stages, task.stages]);

  const handleCompleteStep = async () => {
    try {
      const newCompletedSteps = [...completedSteps];
      newCompletedSteps[currentStepIndex] = true;
      setCompletedSteps(newCompletedSteps);

      onStateChange?.({
        currentStep: currentStepIndex + 1,
        totalSteps: task.stages,
        completed: currentStepIndex + 1 === task.stages,
      });

      await updateTask({
        id: taskId,
        data: {
          completed_stages: currentStepIndex + 1,
          link: task.external_link,
        },
      });

      if (currentStepIndex === task.stages - 1) {
        setTimeout(() => onClose(), 1000);
        return;
      }

      setCurrentStepIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getStepTitle = (step: number) => {
    return task.title;
  };

  const getStepDescription = (step: number) => {
    return task.description;
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
            Этап {currentStepIndex + 1}: {getStepTitle(currentStepIndex)}
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
          <h3 className={s.questionText}>{getStepDescription(currentStepIndex)}</h3>
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
            {currentStepIndex === task.stages - 1 ? 'Завершить' : 'Далее'}
          </button>
        </div>
      </div>
    </BottomModal>
  );
};