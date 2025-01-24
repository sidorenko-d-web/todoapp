import { TaskCard } from '../';
import giftIcon from '../../../assets/icons/gift.svg';

import s from '../styles.module.scss';

export const DailyTasks = () => {
  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>Ежедневное</h2>
        <span className={s.count}>0/1</span>
      </div>
      <div className={s.tasksList}>
        <TaskCard
          title={'Ежедневный подарок'}
          description={'Ответьте на 3 вопроса, чтобы открыть.'}
          type={'progress'}
          icon={giftIcon}
          buttonText={'Открыть подарок'}
        />
      </div>
    </section>
  )
}