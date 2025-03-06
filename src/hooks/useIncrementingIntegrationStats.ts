// useIncrementingIntegrationStats.ts
import { useState, useEffect } from 'react';
import { integrationStatsIncrementer } from '../services';

interface UseIncrementingStatsProps {
  integrationId: string;
  baseSubscribers: number;
  baseViews: number;
  baseIncome: string;
  futureStatistics?: {
    subscribers: number;
    views: number;
    income: string;
  };
  lastUpdatedAt?: string;
}

interface IncrementingStats {
  subscribers: number;
  views: number;
  income: string;
}

export const useIncrementingIntegrationStats = ({
                                       integrationId,
                                       baseSubscribers,
                                       baseViews,
                                       baseIncome,
                                       futureStatistics,
                                       lastUpdatedAt
                                     }: UseIncrementingStatsProps): IncrementingStats => {
  // State for current displayed values
  const [displayedStats, setDisplayedStats] = useState<IncrementingStats>({
    subscribers: baseSubscribers,
    views: baseViews,
    income: baseIncome
  });

  // Initialize or reset stats in the incrementer service
  useEffect(() => {
    if (!futureStatistics || !integrationId) return;

    // Check if we need to reset stats based on new data from the server
    if (lastUpdatedAt) {
      const lastUpdateTime = new Date(lastUpdatedAt).getTime();

      // Store the last update time we processed
      const lastProcessedUpdate = localStorage.getItem(`last_processed_update_${integrationId}`);

      // If this is a new update from the server, reset the stats
      if (!lastProcessedUpdate || parseInt(lastProcessedUpdate) < lastUpdateTime) {
        integrationStatsIncrementer.resetStats(
          integrationId,
          baseSubscribers,
          baseViews,
          baseIncome,
          futureStatistics.subscribers,
          futureStatistics.views,
          futureStatistics.income
        );

        // Remember that we processed this update
        localStorage.setItem(`last_processed_update_${integrationId}`, lastUpdateTime.toString());
      }
    } else if (!integrationStatsIncrementer.hasStats(integrationId)) {
      // If we don't have stats for this integration yet, initialize them
      integrationStatsIncrementer.updateStats(
        integrationId,
        baseSubscribers,
        baseViews,
        baseIncome,
        futureStatistics.subscribers,
        futureStatistics.views,
        futureStatistics.income
      );
    }
  }, [integrationId, baseSubscribers, baseViews, baseIncome, futureStatistics, lastUpdatedAt]);

  // Set up the interval to update display values
  useEffect(() => {
    if (!integrationId) return;

    const updateDisplayValues = () => {
      const currentStats = integrationStatsIncrementer.getCurrentStats(integrationId);

      if (currentStats) {
        setDisplayedStats({
          subscribers: currentStats.subscribers,
          views: currentStats.views,
          income: currentStats.income.toString()
        });
      } else {
        // If no stats in the service, use the base values
        setDisplayedStats({
          subscribers: baseSubscribers,
          views: baseViews,
          income: baseIncome
        });
      }
    };

    // Update immediately
    updateDisplayValues();

    // Set up interval to update every second (1000ms)
    // This is more appropriate for a 10-minute duration to ensure timing accuracy
    const intervalId = setInterval(updateDisplayValues, 2000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [integrationId, baseSubscribers, baseViews, baseIncome]);

  return displayedStats;
};