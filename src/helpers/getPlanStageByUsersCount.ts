import { INFO_TEXT_EN } from '../components/promotion/DevelopmentPlan/constantsPlan';

export const getPlanStageByUsersCount = (usersCount: number): number => {
  for (let i = INFO_TEXT_EN.length - 1; i >= 0; i--) {
    if (usersCount >= INFO_TEXT_EN[i].userCount) {
      return i + 1;
    }
  }
  return -1;
};
