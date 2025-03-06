// useIncrementingProfileStats.ts
import { useState, useEffect } from 'react';
import { profileStatsIncrementer } from '../services/profileStatsIncrementerService';
import { FutureStatistics } from '../redux/api/profile/dto'

interface UseIncrementingProfileStatsProps {
  profileId: string;
  basePoints: string;
  baseSubscribers: number;
  baseTotalViews: number;
  baseTotalEarned: string;
  futureStatistics?: FutureStatistics;
  lastUpdatedAt?: string;
}

interface IncrementingProfileStats {
  points: string;
  subscribers: number;
  totalViews: number;
  totalEarned: string;
}

export const useIncrementingProfileStats = ({
                                              profileId,
                                              basePoints,
                                              baseSubscribers,
                                              baseTotalViews,
                                              baseTotalEarned,
                                              futureStatistics,
                                              lastUpdatedAt
                                            }: UseIncrementingProfileStatsProps): IncrementingProfileStats => {
  // State for current displayed values
  const [displayedStats, setDisplayedStats] = useState<IncrementingProfileStats>({
    points: basePoints,
    subscribers: baseSubscribers,
    totalViews: baseTotalViews,
    totalEarned: baseTotalEarned
  });

  // Initialize or reset stats in the incrementer service
  useEffect(() => {
    if (!futureStatistics || !profileId) return;

    // Check if we need to reset stats based on new data from the server
    if (lastUpdatedAt) {
      const lastUpdateTime = new Date(lastUpdatedAt).getTime();

      // Store the last update time we processed
      const lastProcessedUpdate = localStorage.getItem(`last_processed_profile_update_${profileId}`);

      // If this is a new update from the server, reset the stats
      if (!lastProcessedUpdate || parseInt(lastProcessedUpdate) < lastUpdateTime) {
        profileStatsIncrementer.resetStats(
          profileId,
          basePoints,
          baseSubscribers,
          baseTotalViews,
          baseTotalEarned,
          futureStatistics.points,
          futureStatistics.subscribers,
          futureStatistics.total_views,
          futureStatistics.total_earned
        );

        // Remember that we processed this update
        localStorage.setItem(`last_processed_profile_update_${profileId}`, lastUpdateTime.toString());
      }
    } else if (!profileStatsIncrementer.hasStats(profileId)) {
      // If we don't have stats for this profile yet, initialize them
      profileStatsIncrementer.updateStats(
        profileId,
        basePoints,
        baseSubscribers,
        baseTotalViews,
        baseTotalEarned,
        futureStatistics.points,
        futureStatistics.subscribers,
        futureStatistics.total_views,
        futureStatistics.total_earned
      );
    }
  }, [profileId, basePoints, baseSubscribers, baseTotalViews, baseTotalEarned, futureStatistics, lastUpdatedAt]);

  // Set up the interval to update display values
  useEffect(() => {
    if (!profileId) return;

    const updateDisplayValues = () => {
      const currentStats = profileStatsIncrementer.getCurrentStats(profileId);

      if (currentStats) {
        setDisplayedStats({
          points: currentStats.points.toFixed(2),
          subscribers: currentStats.subscribers,
          totalViews: currentStats.totalViews,
          totalEarned: currentStats.totalEarned.toFixed(2)
        });
      } else {
        // If no stats in the service, use the base values
        setDisplayedStats({
          points: basePoints,
          subscribers: baseSubscribers,
          totalViews: baseTotalViews,
          totalEarned: baseTotalEarned
        });
      }
    };

    // Update immediately
    updateDisplayValues();

    // Set up interval to update every second (1000ms)
    const intervalId = setInterval(updateDisplayValues, 2000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [profileId, basePoints, baseSubscribers, baseTotalViews, baseTotalEarned]);

  return displayedStats;
};