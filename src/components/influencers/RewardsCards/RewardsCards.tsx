import fire from '../../../assets/icons/fire-icon.svg';
import person from '../../../assets/icons/person.svg';
import chest from '../../../assets/icons/chest-purple.svg';

import s from './RewardsCards.module.scss';

type RewardsCardsProps = { stepIndex: number }

export const RewardsCards = ({ stepIndex }: RewardsCardsProps) => {
  return (
    <div className={s.rewards}>
      <div className={s.card} aria-disabled={stepIndex === 1}>
        <div className={s.infoBadges}>
          <span className={s.position}>{`# ${stepIndex === 1 ? '???' : 2}`}</span>
          <span className={s.streak}>
                  <img src={fire} alt="fire" width={14} height={14} /> {stepIndex === 1 ? '???' : 12}
                </span>
        </div>
        <img src={person} alt="Person" width={80} height={80} />
      </div>
      <div className={s.card} aria-disabled={stepIndex > -1}>
        <div className={s.infoBadges}>
          <span className={s.position}>{`# ${stepIndex !== -1 ? '???' : 100}`}</span>
        </div>
        <img src={chest} alt="Chest" width={56}
             height={46}
        />
      </div>
    </div>
  );
};