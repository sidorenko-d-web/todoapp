// integrationStatsIncrementerService.ts
class StatsIncrementer {
  private static instance: StatsIncrementer;
  private STORAGE_KEY = 'INTEGRATION_STATS_DATA';

  private statsMap: Record<string, {
    baseValues: {
      subscribers: number;
      views: number;
      income: number;
    };
    futureValues: {
      subscribers: number;
      views: number;
      income: number;
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
  public static getInstance(): StatsIncrementer {
    if (!StatsIncrementer.instance) {
      StatsIncrementer.instance = new StatsIncrementer();
    }
    return StatsIncrementer.instance;
  }

  // Save the current state to localStorage
  private saveStateToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.statsMap));
    } catch (error) {
      console.error('Failed to save stats state to localStorage:', error);
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
      console.error('Failed to load stats state from localStorage:', error);
    }
  }

  // Initialize or update stats for an integration
  public updateStats(
    integrationId: string,
    baseSubscribers: number,
    baseViews: number,
    baseIncome: string,
    futureSubscribers: number,
    futureViews: number,
    futureIncome: string,
    duration = 10 * 60 * 1000 // 10 minutes in milliseconds
  ): void {
    // Parse income values
    const baseIncomeNumber = parseFloat(baseIncome.replace(/[^0-9.-]+/g, ''));
    const futureIncomeNumber = parseFloat(futureIncome.replace(/[^0-9.-]+/g, ''));

    // Only update if this is new data or if we don't have data for this integration
    if (!this.statsMap[integrationId]) {
      this.statsMap[integrationId] = {
        baseValues: {
          subscribers: baseSubscribers,
          views: baseViews,
          income: baseIncomeNumber
        },
        futureValues: {
          subscribers: futureSubscribers,
          views: futureViews,
          income: futureIncomeNumber
        },
        startTime: Date.now(),
        duration
      };

      // Save updated state
      this.saveStateToStorage();
    }
  }

  // Get current stats based on time elapsed
  public getCurrentStats(integrationId: string): {
    subscribers: number;
    views: number;
    income: number;
  } | null {
    const stats = this.statsMap[integrationId];
    if (!stats) return null;

    const now = Date.now();
    const elapsed = now - stats.startTime;
    const progress = Math.min(elapsed / stats.duration, 1); // Capped at 1 (100%)

    // Calculate current values
    return {
      subscribers: Math.floor(stats.baseValues.subscribers + (stats.futureValues.subscribers * progress)),
      views: Math.floor(stats.baseValues.views + (stats.futureValues.views * progress)),
      income: stats.baseValues.income + (stats.futureValues.income * progress)
    };
  }

  // Reset stats for an integration with new base values
  public resetStats(
    integrationId: string,
    baseSubscribers: number,
    baseViews: number,
    baseIncome: string,
    futureSubscribers: number,
    futureViews: number,
    futureIncome: string
  ): void {
    // Parse income values
    const baseIncomeNumber = parseFloat(baseIncome.replace(/[^0-9.-]+/g, ''));
    const futureIncomeNumber = parseFloat(futureIncome.replace(/[^0-9.-]+/g, ''));

    this.statsMap[integrationId] = {
      baseValues: {
        subscribers: baseSubscribers,
        views: baseViews,
        income: baseIncomeNumber
      },
      futureValues: {
        subscribers: futureSubscribers,
        views: futureViews,
        income: futureIncomeNumber
      },
      startTime: Date.now(),
      duration: 10 * 60 * 1000
    };

    // Save updated state
    this.saveStateToStorage();
  }

  // Check if we have stats for an integration
  public hasStats(integrationId: string): boolean {
    return !!this.statsMap[integrationId];
  }

  // Clear stats for an integration
  public clearStats(integrationId: string): void {
    delete this.statsMap[integrationId];
    this.saveStateToStorage();
  }
}

// Export singleton instance
export const integrationStatsIncrementer = StatsIncrementer.getInstance();