import React from "react";
import styles from "./RewardsList.module.scss";
import Reward from "./Reward/Reward";
import { useGetInventoryAchievementsQuery } from "../../../redux/api/inventory/api";
import { useTranslation } from 'react-i18next';

interface RewardItem {
  name: string;
  stars: number;
  medal: "gold" | "silver" | "bronze";
  isActive: boolean;
}

const RewardsList: React.FC = () => {
  const { t } = useTranslation('profile');
  const { data: awardsData, error: awardsError, isLoading: awardsLoading } = useGetInventoryAchievementsQuery();

  const mappedRewards: RewardItem[] = React.useMemo(() => {
    if (!awardsData || !awardsData.achievements) return [];

    return awardsData.achievements
      .map((achievement: { level: number; name: any; is_unlocked: any; }): RewardItem => {
        const medal: "gold" | "silver" | "bronze" =
          achievement.level === 3 ? "gold" : achievement.level === 2 ? "silver" : "bronze";

        return {
          name: achievement.name,
          stars: achievement.level,
          medal,
          isActive: achievement.is_unlocked,
        };
      })
      .sort((a, b) => {
        const medalOrder: Record<"gold" | "silver" | "bronze", number> = { gold: 3, silver: 2, bronze: 1 };
        return medalOrder[b.medal] - medalOrder[a.medal];
      });
  }, [awardsData]);

  console.log(mappedRewards)

  return (
    <>
      {awardsLoading && <p>{t('p3')}</p>}
      {awardsError && <p>{t('p16')}</p>}
      {!awardsLoading && !awardsError && (
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
