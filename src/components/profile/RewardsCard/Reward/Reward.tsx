import React from 'react';
import styles from './Reward.module.scss';
import goldMedal from '../../../../assets/icons/medal-gold.svg';
import silverMedal from '../../../../assets/icons/medal-silver.svg';
import bronzeMedal from '../../../../assets/icons/medal-bronze.svg';
import trophyActive from '../../../../assets/icons/cup-active.svg';
import trophyInactive from '../../../../assets/icons/cup-inactive.svg';
import starBlue from '../../../../assets/icons/star-blue.svg';
import starGray from '../../../../assets/icons/star-dark-gray.svg';
import starWhite from '../../../../assets/icons/star-gray.svg';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared';
import { useAddItemToRoomMutation, useGetEquipedQuery, useRemoveItemFromRoomMutation } from '../../../../redux';

interface RewardProps {
  name: string;
  stars: number;
  medal: 'gold' | 'silver' | 'bronze';
  isActive: boolean;
  id: string;
}

const Reward: React.FC<RewardProps> = ({ name, stars, medal, isActive, id }) => {
  const { t } = useTranslation('profile');
  const { data: equipped_items } = useGetEquipedQuery();
  const [addAchivement, isLoading] = useAddItemToRoomMutation();
  const [removeAchivement] = useRemoveItemFromRoomMutation();

  const medalIcons = {
    gold: goldMedal,
    silver: silverMedal,
    bronze: bronzeMedal,
  };

  const handleEquipAchivement = async () => {
    if (!equipped_items) return;
    console.log(equipped_items);
    try {
      if (equipped_items.achievements.length > 0) {
        const res1 = await removeAchivement({ achievements_to_remove: [{ id: equipped_items?.achievements?.[0].id }] });
        console.log(res1, 1);
      }
      const res = await addAchivement({ equipped_achievements: [{ id, slot: 100 }] });
      console.log(res, 2);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`${styles.reward} ${isActive ? styles.active : styles.inactive}`}>
      <div className={styles.left}>
        <div className={styles.rewardImage}>
          <img src={medalIcons[medal]} alt={`${medal} medal`} className={styles.medal} />
          <img src={starWhite} alt={'Star'} className={styles.star} />
        </div>
        <div className={styles.info}>
          <span className={styles.name}>{name}</span>
          <div className={styles.stars}>
            {Array.from({ length: 3 }, (_, i) => (
              <img key={i} src={i < stars ? starBlue : starGray} className={styles.star} alt={'Star'} />
            ))}
          </div>
        </div>
      </div>

      <Button onClick={handleEquipAchivement} className={styles.status}>
        <img src={isActive ? trophyActive : trophyInactive} className={styles.trophy} />
        <span className={isActive ? styles.activeText : styles.inactiveText}>
          {isActive ? `${t('p18')}` : `${t('p19')}`}
        </span>
      </Button>
    </div>
  );
};

export default Reward;
