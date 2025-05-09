import React from 'react';
import styles from './RewardsList.module.scss';
import Reward from './Reward/Reward';
import { useGetInventoryAchievementsQuery } from '../../../redux';
import { useTranslation } from 'react-i18next';
import { IAchievement, useGetEquipedQuery } from '../../../redux';

interface RewardItem {
  name: string;
  name_eng: string;
  stars: number;
  medal: 'gold' | 'silver' | 'bronze';
  isActive: boolean;
  id: string;
}

const RewardsList: React.FC = () => {
  const { t } = useTranslation('profile');
  const { data: awardsData, error: awardsError, isLoading: awardsLoading } = useGetInventoryAchievementsQuery();
  const { data: roomData, isLoading: roomLoading } = useGetEquipedQuery();
  const mappedRewards: RewardItem[] = React.useMemo(() => {
    if (!awardsData || !awardsData.achievements) return [];

    return awardsData.achievements
      .filter(item => !item.name.includes('этапа'))
      .map((achievement: IAchievement): RewardItem => {
        const medal: 'gold' | 'silver' | 'bronze' =
          achievement.level === 3 ? 'gold' : achievement.level === 2 ? 'silver' : 'bronze';
        return {
          name: achievement.name,
          name_eng: achievement.name_eng,
          stars: achievement.level,
          medal,
          isActive: achievement.id === roomData?.achievements?.[0]?.id,
          id: achievement.id,
        };
      })
      .sort((a, b) => {
        const medalOrder: Record<'gold' | 'silver' | 'bronze', number> = { gold: 3, silver: 2, bronze: 1 };
        return medalOrder[b.medal] - medalOrder[a.medal];
      });
  }, [awardsData, roomData]);

  return (
    <>
      {(awardsLoading || roomLoading) && <p>{t('p3')}</p>}
      {awardsError && <p>{t('p16')}</p>}
      {!roomLoading && !awardsLoading && !awardsError && (
        <div className={styles.rewardsList}>
          <div className={styles.list}>
            {mappedRewards.map((reward: RewardItem, index: number) => (
              <Reward key={index} {...reward} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RewardsList;
