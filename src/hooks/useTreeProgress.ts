import { useEffect, useState } from 'react';
import { GrowthTreeStage } from '../redux';

interface UseTreeProgressProps {
  treeData?: {
    growth_tree_stages: GrowthTreeStage[];
  };
  userSubscribers: number;
}

export const useTreeProgress = ({ treeData, userSubscribers }: UseTreeProgressProps) => {
  const [progressPercent, setProgressPercent] = useState(0);
  const [userLevel, setUserLevel] = useState(0);
  const [currentLevelSubscribers, setCurrentLevelSubscribers] = useState(0);
  const [nextLevelSubscribers, setNextLevelSubscribers] = useState(0);

  useEffect(() => {
    if (treeData) {
      let level = 0;
      let currentSubscribers = 0;
      let nextSubscribers = 0;

      treeData.growth_tree_stages.forEach((stage, index) => {
        if (userSubscribers >= stage.subscribers) {
          level = index;
          currentSubscribers = stage.subscribers;
          nextSubscribers = treeData.growth_tree_stages[level + 1]?.subscribers || currentSubscribers;
        }
      });

      const levelsCount = treeData.growth_tree_stages.length;
      const initialOffset = 150;
      const levelGap = 300;
      const progressBarHeight = initialOffset + (levelsCount - 1) * levelGap;

      let progress = 0;

      if (nextSubscribers === currentSubscribers) {
        progress = 100;
      } else {
        const baseHeight = initialOffset + level * levelGap;
        const levelProgress = ((userSubscribers - currentSubscribers) / (nextSubscribers - currentSubscribers)) * levelGap;
        const totalProgressHeight = baseHeight + levelProgress;

        progress = (totalProgressHeight / progressBarHeight) * 100;
        progress = Math.min(Math.max(progress, 0), 100);
      }

      setUserLevel(level);
      setCurrentLevelSubscribers(currentSubscribers);
      setNextLevelSubscribers(nextSubscribers);
      setProgressPercent(progress);
    }
  }, [treeData, userSubscribers]);

  return { progressPercent, userLevel, currentLevelSubscribers, nextLevelSubscribers };
};
