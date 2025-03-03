import { FC, useState, useEffect } from 'react';
import { TaskCard } from '../';
import telegramIcon from '../../../assets/icons/telegram.png';
import instagramIcon from '../../../assets/icons/instagram.png';
import s from '../styles.module.scss';
import { Task } from '../../../redux/api/tasks';
import { useUpdateTaskMutation } from '../../../redux/api/tasks';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants';

const TELEGRAM_CHANNEL_URL = 'https://t.me/apusherTestCh';

type SocialTasksProps = {
  tasks: Task[];
};

export const SocialTasks: FC<SocialTasksProps> = ({ tasks }) => {
  const { t } = useTranslation('quests');
  const completedTasks = tasks.filter(task => task.is_completed).length;
  const [updateTask] = useUpdateTaskMutation();
  const { openModal } = useModal();
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);

  const handleTaskClick = async (task: Task) => {
    if (task.is_completed && !task.is_reward_given) {
      openModal(MODALS.GET_GIFT);
      return;
    }

    try {
      if (!task.is_completed) {
        setPendingTaskId(task.id);
        localStorage.setItem('pendingTaskId', task.id);
        localStorage.setItem('pendingTaskStartTime', Date.now().toString());

        // Ждем 30 секунд
        await new Promise(resolve => setTimeout(resolve, 30000));

        const response = await updateTask({
          id: task.id,
          data: {
            completed_stages: task.stages,
            link: task.external_link
          }
        }).unwrap();

        if (task.title.toLowerCase().includes('telegram')) {
          window.open(response.link || TELEGRAM_CHANNEL_URL, '_blank');
        } else if (task.external_link) {
          window.open(response.link || task.external_link, '_blank');
        }

        localStorage.removeItem('pendingTaskId');
        localStorage.removeItem('pendingTaskStartTime');
        setPendingTaskId(null);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      localStorage.removeItem('pendingTaskId');
      localStorage.removeItem('pendingTaskStartTime');
      setPendingTaskId(null);
    }
  };

  // Проверяем при загрузке компонента
  useEffect(() => {
    const savedTaskId = localStorage.getItem('pendingTaskId');
    const startTime = localStorage.getItem('pendingTaskStartTime');
    
    if (savedTaskId && startTime) {
      const elapsedTime = Date.now() - Number(startTime);
      const remainingTime = Math.max(30000 - elapsedTime, 0);

      setPendingTaskId(savedTaskId);

      if (remainingTime > 0) {
        setTimeout(async () => {
          const task = tasks.find(t => t.id === savedTaskId);
          if (task) {
            try {
              const response = await updateTask({
                id: task.id,
                data: {
                  completed_stages: task.stages,
                  link: task.external_link
                }
              }).unwrap();

              if (task.title.toLowerCase().includes('telegram')) {
                window.open(response.link || TELEGRAM_CHANNEL_URL, '_blank');
              } else if (task.external_link) {
                window.open(response.link || task.external_link, '_blank');
              }
            } catch (error) {
              console.error('Error updating task:', error);
            }
          }
          localStorage.removeItem('pendingTaskId');
          localStorage.removeItem('pendingTaskStartTime');
          setPendingTaskId(null);
        }, remainingTime);
      } else {
        // Если время уже прошло, сразу отправляем запрос
        const task = tasks.find(t => t.id === savedTaskId);
        if (task) {
          updateTask({
            id: task.id,
            data: {
              completed_stages: task.stages,
              link: task.external_link
            }
          });
        }
        localStorage.removeItem('pendingTaskId');
        localStorage.removeItem('pendingTaskStartTime');
        setPendingTaskId(null);
      }
    }
  }, []);

  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>{t('q50')}</h2>
        <span className={s.count}>{completedTasks}/{tasks.length}</span>
      </div>
      <div className={s.tasksList}>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            title={task.title}
            description={task.description}
            icon={task.title.toLowerCase().includes('telegram') ? telegramIcon : instagramIcon}
            income={Number(task.boost.views)}
            subscribers={task.boost.subscribers}
            passiveIncome={Number(task.boost.income_per_second)}
            buttonText={
              pendingTaskId === task.id ? t('q51') :
              task.is_completed && !task.is_reward_given ? t('q33') :
              task.is_completed ? t('q15') : t('q13')
            }
            isCompleted={task.is_completed}
            isRewardGiven={task.is_reward_given}
            showProgressBar={false}
            onClick={() => handleTaskClick(task)}
            disabled={task.is_reward_given || pendingTaskId === task.id}
            isSocialTask={true}
            isLoading={pendingTaskId === task.id}
          />
        ))}
      </div>
    </section>
  );
};