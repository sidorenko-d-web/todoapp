import { FC } from 'react';
import { TaskCard } from '../';
import telegramIcon from '../../../assets/icons/telegram.png';
import instagramIcon from '../../../assets/icons/instagram.png';
import s from '../styles.module.scss';
import { Task } from '../../../redux/api/tasks/dto';

const TELEGRAM_CHANNEL_URL = 'https://t.me/pushtoyours';

type SocialTasksProps = {
  tasks: Task[];
};

export const SocialTasks: FC<SocialTasksProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.is_completed).length;

  const handleTaskClick = (task: Task) => {
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