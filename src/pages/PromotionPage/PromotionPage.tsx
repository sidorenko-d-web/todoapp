import React from 'react';
import subscribersIcon from '../../assets/icons/subscribers.svg';
import clanRed from '../../assets/icons/clanRed.svg';
import { DevelopmentPlan, IncreaseIncome, TopInfluencers } from '../../components';

import s from './PromotionPage.module.scss';

export const PromotionPage: React.FC = () => {
  return (
    <main className={s.page}>
      <section className={s.topSection}>
        <h1 className={s.pageTitle}>Продвижение</h1>
        <div className={s.badges}>
          <span className={s.badge}>#345 <img src={clanRed} height={14} width={14} alt={'income'} /></span>
          <span className={s.badge}>+440 <img src={subscribersIcon} height={14} width={14}
                                              alt={'subscribers'} /></span>
        </div>
        <IncreaseIncome/>
        <TopInfluencers/>
        <DevelopmentPlan/>
      </section>
    </main>
  );
};