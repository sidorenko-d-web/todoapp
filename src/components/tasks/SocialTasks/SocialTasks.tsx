import { FC, useState, useEffect } from 'react';
import { TaskCard } from '../';
import telegramIcon from '../../../assets/icons/telegram.png';
import instagramIcon from '../../../assets/icons/instagram.png';
import discordIcon from '../../../assets/icons/discord.png';
import tiktokIcon from '../../../assets/icons/tiktok.png';
import twitterIcon from '../../../assets/icons/twitter.png';
import vkIcon from '../../../assets/icons/vk.png';
import youtubeIcon from '../../../assets/icons/youtube.png';

import s from '../styles.module.scss';
import { Task } from '../../../redux/api/tasks';
import { useUpdateTaskMutation, useGetAssignmentRewardMutation } from '../../../redux/api/tasks';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants';
import TaskCompletedModal from '../../../pages/DevModals/TaskCompletedModal/TaskCompletedModal';
import { Loader } from '../../Loader';
import { WithModal } from '../../shared/WithModal/WithModa';

const TELEGRAM_CHANNEL_URL = 'https://t.me/tgnewss_vf';

type SocialTasksProps = {
  tasks: Task[];
};

const getTaskIcon = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('telegram')) return telegramIcon;
  if (lowerTitle.includes('instagram')) return instagramIcon;
  if (lowerTitle.includes('discord')) return discordIcon;
  if (lowerTitle.includes('tiktok')) return tiktokIcon;
  if (lowerTitle.includes('twitter') || lowerTitle.includes('x')) return twitterIcon;
  if (lowerTitle.includes('vk')) return vkIcon;
  if (lowerTitle.includes('youtube')) return youtubeIcon;
  return telegramIcon; // default fallback
};

const preloadImages = (imageUrls: string[]): Promise<void[]> => {
  return Promise.all(
    imageUrls.map(url => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image at ${url}`));
      });
    }),
  );
};

export const SocialTasks: FC<SocialTasksProps> = ({ tasks }) => {
  const { t } = useTranslation('quests');
  const completedTasks = tasks.filter(task => task.is_completed).length;
  const [updateTask] = useUpdateTaskMutation();
  const [getAssignmentReward] = useGetAssignmentRewardMutation();
  const { openModal } = useModal();
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const imageUrls = tasks.map(task => getTaskIcon(task.title));
    preloadImages(imageUrls)
      .then(() => setImagesLoaded(true))
      .catch(error => console.error('Error preloading images:', error));
  }, [tasks]);

  const handleTaskClick = async (task: Task) => {
    if (task.is_completed && !task.is_reward_given) {
      try {
        const result = await getAssignmentReward({
          category: task.category,
          assignmentId: task.id,
        }).unwrap();

        setSelectedTask({
          ...task,
          boost: {
            income_per_second: result.income_per_second,
            subscribers: result.subscribers,
            views: result.views,
          },
        });
        openModal(MODALS.TASK_COMPLETED);
        return;
      } catch (error) {
        console.error('Error getting assignment reward:', error);
      }
    }

    try {
      if (!task.is_completed) {
        setPendingTaskId(task.id);
        localStorage.setItem('pendingTaskId', task.id);
        localStorage.setItem('pendingTaskStartTime', Date.now().toString());

        const linkToOpen = task.title.toLowerCase().includes('telegram')
          ? task.external_link || TELEGRAM_CHANNEL_URL
          : task.external_link;
        window.open(linkToOpen, '_blank');

        await new Promise(resolve => setTimeout(resolve, 15000));

        await updateTask({
          id: task.id,
          data: {
            completed_stages: task.stages,
            link: task.external_link,
          },
        }).unwrap();

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

  useEffect(() => {
    const savedTaskId = localStorage.getItem('pendingTaskId');
    const startTime = localStorage.getItem('pendingTaskStartTime');

    if (savedTaskId && startTime) {
      const elapsedTime = Date.now() - Number(startTime);
      const remainingTime = Math.max(15000 - elapsedTime, 0);

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
                  link: task.external_link,
                },
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
        const task = tasks.find(t => t.id === savedTaskId);
        if (task) {
          updateTask({
            id: task.id,
            data: {
              completed_stages: task.stages,
              link: task.external_link,
            },
          });
        }
        localStorage.removeItem('pendingTaskId');
        localStorage.removeItem('pendingTaskStartTime');
        setPendingTaskId(null);
      }
    }
  }, []);

  const visibleTasks = tasks.filter(task => !task.is_completed || (task.is_completed && !task.is_reward_given));

  if (!imagesLoaded) {
    return <Loader />; // Показываем лоадер, пока изображения загружаются
  }

  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>{t('q50')}</h2>
        <span className={s.count}>
          {completedTasks}/{tasks.length}
        </span>
      </div>
      <div className={s.tasksList}>
        {visibleTasks.map(task => (
          <TaskCard
            key={task.id}
            title={task.title}
            description={task.description}
            icon={getTaskIcon(task.title)}
            income={Number(task.boost.views)}
            subscribers={task.boost.subscribers}
            passiveIncome={Number(task.boost.income_per_second)}
            buttonText={
              pendingTaskId === task.id
                ? t('q51')
                : task.is_completed && !task.is_reward_given
                ? t('q33')
                : task.is_completed
                ? t('q15')
                : t('q13')
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
      {selectedTask && (
        <WithModal
          modalId={MODALS.TASK_COMPLETED}
          component={
            <TaskCompletedModal
              income={Number(selectedTask.boost.views)}
              subscribers={selectedTask.boost.subscribers}
              passiveIncome={Number(selectedTask.boost.income_per_second)}
            />
          }
        />
      )}
    </section>
  );
};
