import { GrowthTreeStage } from '../redux';


export const hasAvailableTreeReward = (data: GrowthTreeStage[]): boolean =>
  data.some(
    ({ achievement: { is_unlocked, is_available } }) =>
      is_available && !is_unlocked
  );