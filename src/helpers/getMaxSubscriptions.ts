export function getMaxSubscriptions(): number {

    const treeLvl = parseInt(localStorage.getItem('USER_LEVEL') || '0');
    
    const MIN = 3;
  
    if (treeLvl === 1) return 0 + MIN;
  
    if (treeLvl >= 2 && treeLvl <= 5) return 1 + MIN;
    if (treeLvl >= 6 && treeLvl <= 11) return 2 + MIN;
    if (treeLvl >= 12 && treeLvl <= 17) return 3 + MIN;
    if (treeLvl >= 18 && treeLvl <= 27) return 4 + MIN;
    if (treeLvl >= 28 && treeLvl <= 41) return 5 + MIN;
    if (treeLvl >= 42 && treeLvl <= 49) return 6 + MIN;
    if (treeLvl >= 50 && treeLvl <= 67) return 7 + MIN;
    if (treeLvl >= 68 && treeLvl <= 89) return 8 + MIN;
    if (treeLvl >= 90 && treeLvl <= 119) return 9 + MIN;
    if (treeLvl >= 120 && treeLvl <= 150) return 10 + MIN;
    if (treeLvl >= 151 && treeLvl <= 179) return 11 + MIN;
    if (treeLvl >= 180 && treeLvl <= 219) return 12 + MIN;
    if (treeLvl >= 220 && treeLvl <= 259) return 13 + MIN;
    if (treeLvl >= 260 && treeLvl <= 319) return 14 + MIN;
    if (treeLvl >= 320 && treeLvl <= 450) return 15 + MIN;
  
    return 0 + MIN;
  }
  
  export function isSubscriptionIncreaseLevel(): boolean {
    const currentLevel = parseInt(localStorage.getItem('USER_LEVEL') || '0');
    const increaseLevels = [1, 2, 6, 12, 18, 28, 42, 50, 68, 90, 120, 151, 180, 220, 260, 320];
    
    return increaseLevels.includes(currentLevel);
}