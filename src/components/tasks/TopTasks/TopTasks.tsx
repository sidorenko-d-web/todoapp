import { TaskCard } from '../TaskCard';
import magicBallIcon from '/magic-ball.png';
import chestIcon from '../../../assets/icons/chest.svg';

import s from '../styles.module.scss';

export const TopTasks = () => {
  return (
    <section className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>Топ-задания</h2>
        <span className={s.count}>0/1</span>
      </div>
      <div className={s.tasksList}>
        <TaskCard
          title={'Создайте личный канал'}
          description={'Продвигайтесь и получайте награды.'}
          icon={magicBallIcon}
          buttonType={'secondary'}
          income={150}
          subscribers={10}
          passiveIncome={5}
          showProgressBar
          progress={15}
          totalSteps={4}
          currentStep={1}
          progressReward={'Драгоценный сундук'}
          progressRewardIcon={chestIcon}
        />
      </div>
    </section>
  )
}
