import { FC } from 'react';
import { TaskCard } from '../';
import telegramIcon from '../../../assets/icons/telegram.png';
import instagramIcon from '../../../assets/icons/instagram.png';
import s from '../styles.module.scss';
import { useGetTasksQuery } from '../../../redux/api/tasks/api';

const TELEGRAM_CHANNEL_URL = 'https://t.me/pushtoyours';

export const SocialTasks: FC = () => {
  const { data: tasksData } = useGetTasksQuery();
  
  const socialTasks = tasksData?.assignments.filter(
    task => task.category === 'subscribe'
  ) || [];

  const completedTasks = socialTasks.filter(task => task.is_completed).length;

  const handleTaskClick = (task: any) => {
    if (task.title.toLowerCase().includes('telegram')) {
      window.open(TELEGRAM_CHANNEL_URL, '_blank');
    } else if (task.external_link) {
      window.open(task.external_link, '_blank');
    }
  };

  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>Подписки на социальные сети</h2>
        <span className={s.count}>{completedTasks}/{socialTasks.length}</span>
      </div>
      <div className={s.tasksList}>
        {socialTasks.map(task => (
          <TaskCard
            key={task.id}
            title={task.title}
            description={task.description}
            icon={task.title.toLowerCase().includes('telegram') ? telegramIcon : instagramIcon}
            income={Number(task.boost.views)}
            subscribers={task.boost.subscribers}
            passiveIncome={Number(task.boost.income_per_second)}
            buttonText={task.is_completed ? 'Выполнено' : 'Выполнить'}
            isCompleted={task.is_completed}
            showProgressBar={false}
            onClick={() => handleTaskClick(task)}
          />
        ))}
      </div>
    </section>
  );
};