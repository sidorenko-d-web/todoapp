import React from 'react';
import subscribersIcon from '../../assets/icons/subscribers.svg';
import icon from '../../assets/icons/clanRed.svg';

import s from './PromotionPage.module.scss';

const PromotionPage: React.FC = () => {
  return (
    <main className={s.page}>
      <section className={s.topSection}>
        <h1 className={s.pageTitle}>Продвижение</h1>
        <div className={s.badges}>
          <span className={s.badge}>#345 <img src={icon} height={14} width={14} alt={'income'} /></span>
          <span className={s.badge}>+440 <img src={subscribersIcon} height={14} width={14}
                                              alt={'subscribers'} /></span>
        </div>
      </section>

    </main>
  );
};

export default PromotionPage;