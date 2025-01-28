import React from "react";

import styles from "./RewardsList.module.scss";
import Reward from "./Reward/Reward";

const rewardsData = [
  { name: "Награда Mike", stars: 3, medal: "gold" as "gold", isActive: true },
  { name: "Награда Advdas", stars: 2, medal: "silver" as "silver", isActive: false },
  { name: "Награда Purna", stars: 1, medal: "bronze" as "bronze", isActive: false },
];

const RewardsList: React.FC = () => {
  return (
    <div className={styles.rewardsList}>
      <div className={styles.list}>
        {rewardsData.map((reward, index) => (
          <Reward key={index} {...reward} />
        ))}
      </div>
    </div>
  );
};

export default RewardsList;
