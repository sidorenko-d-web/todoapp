import React from 'react';
import { TaskCard } from '../../components';
import subscribersIcon from '../../assets/icons/subscribers.svg';
import coinIcon from '../../assets/icons/coin.svg';
import chestIcon from '../../assets/icons/chest.svg';
import giftIcon from '../../assets/icons/gift.svg';
import magicBallIcon from '../../../public/magic-ball.png';
import telegramIcon from '../../../public/telegram.png';
import instagramIcon from '../../../public/instagram.png';

import s from './TasksPage.module.scss';

const TasksPage: React.FC = () => {
  return (
    <main className={s.page}>
      <section className={s.topSection}>
        <h1 className={s.pageTitle}>Задания</h1>
        <div className={s.badges}>
          <span className={s.badge}>+100 <img src={coinIcon} height={14} width={14} alt={'income'} />/сек.</span>
          <span className={s.badge}>+150 <img src={subscribersIcon} height={14} width={14}
                                              alt={'subscribers'} />/сек.</span>
        </div>
      </section>

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
    </main>
  );
};

export default TasksPage;