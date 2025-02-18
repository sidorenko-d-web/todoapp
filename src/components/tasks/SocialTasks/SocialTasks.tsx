import { FC } from 'react';
import { TaskCard } from '../';
import telegramIcon from '../../../assets/icons/telegram.png';
import instagramIcon from '../../../assets/icons/instagram.png';
import s from '../styles.module.scss';
import { Task } from '../../../redux/api/tasks/dto';
import { useGetDailyRewardQuery, useUpdateTaskMutation } from '../../../redux/api/tasks/api';
import { useTranslation } from 'react-i18next';

const TELEGRAM_CHANNEL_URL = 'https://t.me/pushtoyours';

type SocialTasksProps = {
  tasks: Task[];
};

export const SocialTasks: FC<SocialTasksProps> = ({ tasks }) => {
  const { t } = useTranslation('quests');
  const completedTasks = tasks.filter(task => task.is_completed).length;
  const [updateTask] = useUpdateTaskMutation();

  const handleTaskClick = async (task: Task) => {
    if (task.is_completed && !task.is_reward_given) {
      try {
        const { refetch: getDailyReward } = useGetDailyRewardQuery(task.id, { skip: true });
        const result = await getDailyReward();
        console.log('Social Reward API Response:', result);
      } catch (error) {
        console.error('Error fetching social reward:', error);
      }
      return;
    }

    try {
      if (!task.is_completed) {
        await updateTask({
          id: task.id,
          data: {
            completed_stages: task.stages,
            link: task.external_link
          }
        });
      }

      if (task.title.toLowerCase().includes('telegram')) {
        window.open(TELEGRAM_CHANNEL_URL, '_blank');
      } else if (task.external_link) {
        window.open(task.external_link, '_blank');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>{t('q12')}</h2>
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
            buttonText={task.is_completed && !task.is_reward_given ? 'Забрать награду' : task.is_completed ? t('q15') : t('q13')}
            isCompleted={task.is_completed}
            showProgressBar={false}
            onClick={() => handleTaskClick(task)}
            disabled={task.is_reward_given}
            isSocialTask={true}
          />
        ))}
      </div>
    </section>
  );
};