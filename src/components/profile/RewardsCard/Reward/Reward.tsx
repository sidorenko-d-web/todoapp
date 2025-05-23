import React, { useEffect, useState } from 'react'; // Добавлен useState
import styles from './Reward.module.scss';
import goldMedal from '../../../../assets/icons/medal-gold.svg';
import silverMedal from '../../../../assets/icons/medal-silver.svg';
import bronzeMedal from '../../../../assets/icons/medal-bronze.svg';
import trophyActive from '../../../../assets/icons/cup-active.svg';
import trophyInactive from '../../../../assets/icons/cup-inactive.svg';
import starBlue from '../../../../assets/icons/star-blue.svg';
import starGray from '../../../../assets/icons/star-dark-gray.svg';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared';
import {
  useAddItemToRoomMutation,
  useGetEquipedQuery,
  useGetInventoryAchievementsQuery,
  useRemoveItemFromRoomMutation,
} from '../../../../redux';
import clsx from 'clsx';
import { getAchivementType } from '../../../../helpers';

interface RewardProps {
  name: string;
  name_eng: string;
  stars: number;
  medal: 'gold' | 'silver' | 'bronze';
  isActive: boolean;
  id: string;
}

const Reward: React.FC<RewardProps> = ({ name, name_eng, stars, medal, isActive: initialIsActive, id }) => {
  const { t, i18n } = useTranslation('profile');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  const { data: equipped_items } = useGetEquipedQuery();
  const { refetch } = useGetInventoryAchievementsQuery();
  const [addAchivement] = useAddItemToRoomMutation();
  const [removeAchivement] = useRemoveItemFromRoomMutation();

  const [isActive, setIsActive] = useState(initialIsActive);

  const medalIcons = {
    gold: goldMedal,
    silver: silverMedal,
    bronze: bronzeMedal,
  };

  useEffect(() => {
    setIsActive(initialIsActive);
  }, [initialIsActive]);

  const handleEquipAchivement = async () => {
    if (!equipped_items) return;

    setIsActive(false);

    try {
      if (equipped_items.achievements.length > 0) {
        await removeAchivement({ achievements_to_remove: [{ id: equipped_items?.achievements?.[0].id }] });
      }
      await addAchivement({ equipped_achievements: [{ id, slot: 100 }] });
      refetch();
    } catch (error) {
      console.log(error);
      setIsActive(initialIsActive);
    }
  };

  const itemType = getAchivementType(name, medal);

  return (
    <div className={`${styles.reward} ${isActive ? styles.active : styles.inactive}`}>
      <div className={styles.left}>
        <div className={styles.rewardImage}>
          {medal && <img src={medalIcons[medal]} alt={`${medal} medal`} className={styles.medal} />}
          <img
            src={itemType.image}
            alt={'Star'}
            className={clsx(styles.star, itemType.type === 'stage' && styles.stage)}
          />
        </div>
        <div className={styles.info}>
          <span className={styles.name}>{locale === 'ru' ? name : name_eng}</span>
          <div className={styles.stars}>
            {Array.from({ length: 3 }, (_, i) => (
              <img key={i} src={i < stars ? starBlue : starGray} className={styles.star} alt={'Star'} />
            ))}
          </div>
        </div>
      </div>

      {itemType.type !== 'stage' && (
        <Button onClick={handleEquipAchivement} className={styles.status}>
          <img src={isActive ? trophyActive : trophyInactive} className={styles.trophy} />
          <span className={isActive ? styles.activeText : styles.inactiveText}>
            {isActive ? `${t('p18')}` : `${t('p19')}`}
          </span>
        </Button>
      )}
    </div>
  );
};

export default Reward;
