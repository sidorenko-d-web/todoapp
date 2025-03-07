// profileStatsIncrementerService.ts
class ProfileStatsIncrementer {
  private static instance: ProfileStatsIncrementer;
  private STORAGE_KEY = 'PROFILE_STATS_DATA';

  private statsMap: Record<string, {
    baseValues: {
      points: number;
      subscribers: number;
      totalViews: number;
      totalEarned: number;
    };
    futureValues: {
      points: number;
      subscribers: number;
      totalViews: number;
      totalEarned: number;
    };
    startTime: number;
    duration: number;
  }> = {};

  // Private constructor for singleton
  private constructor() {
    // Load saved state from localStorage on initialization
    this.loadStateFromStorage();
  }

  // Get singleton instance
  public static getInstance(): ProfileStatsIncrementer {
    if (!ProfileStatsIncrementer.instance) {
      ProfileStatsIncrementer.instance = new ProfileStatsIncrementer();
    }
    return ProfileStatsIncrementer.instance;
  }

  // Save the current state to localStorage
  private saveStateToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.statsMap));
    } catch (error) {
      console.error('Failed to save profile stats state to localStorage:', error);
    }
  }

  // Load state from localStorage
  private loadStateFromStorage(): void {
    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      if (savedState) {
        this.statsMap = JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Failed to load profile stats state from localStorage:', error);
    }
  }

  // Initialize or update stats for a profile
  public updateStats(
    profileId: string,
    basePoints: string,
    baseSubscribers: number,
    baseTotalViews: number,
    baseTotalEarned: string,
    futurePoints: string,
    futureSubscribers: number,
    futureTotalViews: number,
    futureTotalEarned: string,
    duration = 10 * 60 * 1000 // 10 minutes in milliseconds
  ): void {
    // Parse numeric values from strings
    const basePointsNumber = parseFloat(basePoints.replace(/[^0-9.-]+/g, ''));
    const baseTotalEarnedNumber = parseFloat(baseTotalEarned.replace(/[^0-9.-]+/g, ''));
    const futurePointsNumber = parseFloat(futurePoints.replace(/[^0-9.-]+/g, ''));
    const futureTotalEarnedNumber = parseFloat(futureTotalEarned.replace(/[^0-9.-]+/g, ''));

    // Only update if we don't have data for this profile
    if (!this.statsMap[profileId]) {
      this.statsMap[profileId] = {
        baseValues: {
          points: basePointsNumber,
          subscribers: baseSubscribers,
          totalViews: baseTotalViews,
          totalEarned: baseTotalEarnedNumber
        },
        futureValues: {
          points: futurePointsNumber,
          subscribers: futureSubscribers,
          totalViews: futureTotalViews,
          totalEarned: futureTotalEarnedNumber
        },
        startTime: Date.now(),
        duration
      };

      // Save updated state
      this.saveStateToStorage();
    }
  }

  // Get current stats based on time elapsed
  public getCurrentStats(profileId: string): {
    points: number;
    subscribers: number;
    totalViews: number;
    totalEarned: number;
  } | null {
    const stats = this.statsMap[profileId];
    if (!stats) return null;

    const now = Date.now();
    const elapsed = now - stats.startTime;
    const progress = Math.min(elapsed / stats.duration, 1); // Capped at 1 (100%)

    // Calculate current values
    return {
      points: stats.baseValues.points + (stats.futureValues.points * progress),
      subscribers: Math.floor(stats.baseValues.subscribers + (stats.futureValues.subscribers * progress)),
      totalViews: Math.floor(stats.baseValues.totalViews + (stats.futureValues.totalViews * progress)),
      totalEarned: stats.baseValues.totalEarned + (stats.futureValues.totalEarned * progress)
    };
  }

  // Reset stats for a profile with new base values
  public resetStats(
    profileId: string,
    basePoints: string,
    baseSubscribers: number,
    baseTotalViews: number,
    baseTotalEarned: string,
    futurePoints: string,
    futureSubscribers: number,
    futureTotalViews: number,
    futureTotalEarned: string
  ): void {
    // Parse numeric values from strings
    const basePointsNumber = parseFloat(basePoints.replace(/[^0-9.-]+/g, ''));
    const baseTotalEarnedNumber = parseFloat(baseTotalEarned.replace(/[^0-9.-]+/g, ''));
    const futurePointsNumber = parseFloat(futurePoints.replace(/[^0-9.-]+/g, ''));
    const futureTotalEarnedNumber = parseFloat(futureTotalEarned.replace(/[^0-9.-]+/g, ''));

    this.statsMap[profileId] = {
      baseValues: {
        points: basePointsNumber,
        subscribers: baseSubscribers,
        totalViews: baseTotalViews,
        totalEarned: baseTotalEarnedNumber
      },
      futureValues: {
        points: futurePointsNumber,
        subscribers: futureSubscribers,
        totalViews: futureTotalViews,
        totalEarned: futureTotalEarnedNumber
      },
      startTime: Date.now(),
      duration: 10 * 60 * 1000
    };

    // Save updated state
    this.saveStateToStorage();
  }

  // Check if we have stats for a profile
  public hasStats(profileId: string): boolean {
    return !!this.statsMap[profileId];
  }

  // Clear stats for a profile
  public clearStats(profileId: string): void {
    delete this.statsMap[profileId];
    this.saveStateToStorage();
  }
}

// Export singleton instance
export const profileStatsIncrementer = ProfileStatsIncrementer.getInstance();