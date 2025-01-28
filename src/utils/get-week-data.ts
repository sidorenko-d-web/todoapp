import { DayType } from "../types";


export type StreakDay = {
  day: number;
  type: DayType;
};

export const getWeekData = (streakDays: number[], freezeDays: number[]): StreakDay[] => {
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  
  const weekStart = new Date();
  weekStart.setDate(today.getDate() + mondayOffset);

  const weekData: StreakDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const dayNumber = date.getDate();

    let type: DayType = "regular";
    if (streakDays.includes(dayNumber)) type = "streak";
    else if (freezeDays.includes(dayNumber)) type = "freeze";

    weekData.push({ day: dayNumber, type });
  }

  return weekData;
};
