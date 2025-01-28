import { TaskCard } from '../';
import telegramIcon from '/telegram.png';
import instagramIcon from '/instagram.png';

import s from '../styles.module.scss';

export const SocialTasks = () => {
  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>Подписки на социальные сети</h2>
        <span className={s.count}>0/1</span>
      </div>
      <div className={s.tasksList}>
        <TaskCard
          title={'Telegram'}
          description={'Подпишитесь на наш блог.'}
          icon={telegramIcon}
          income={150}
          subscribers={10}
          passiveIncome={1}
          buttonText={'Проверяем...'}
          isLoading
        />
        <TaskCard
          title={'Instagram'}
          description={'Подпишитесь на наш блог.'}
          icon={instagramIcon}
          income={150}
          subscribers={10}
          passiveIncome={1}
        />
      </div>
    </section>
  )
}