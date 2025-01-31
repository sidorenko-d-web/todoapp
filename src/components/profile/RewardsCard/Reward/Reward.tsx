import React from "react";
import styles from "./Reward.module.scss";
import goldMedal from "../../../../assets/icons/medal-gold.svg";
import silverMedal from "../../../../assets/icons/medal-silver.svg";
import bronzeMedal from "../../../../assets/icons/medal-bronze.svg";
import trophyActive from "../../../../assets/icons/cup-active.svg";
import trophyInactive from "../../../../assets/icons/cup-inactive.svg";

interface RewardProps {
    name: string;
    stars: number;
    medal: "gold" | "silver" | "bronze";
    isActive: boolean;
}

const Reward: React.FC<RewardProps> = ({ name, stars, medal, isActive }) => {
    const medalIcons = {
        gold: goldMedal,
        silver: silverMedal,
        bronze: bronzeMedal,
    };

    return (
        <div className={`${styles.reward} ${isActive ? styles.active : styles.inactive}`}>
            <div className={styles.left}>
                <div className={styles.rewardImage}>
                    <img src={medalIcons[medal]} alt={`${medal} medal`} className={styles.medal} />
                </div>
                <div className={styles.info}>
                    <span className={styles.name}>{name}</span>
                    <div className={styles.stars}>
                        {Array.from({ length: 3 }, (_, i) => (
                            <span key={i} className={i < stars ? styles.filledStar : styles.emptyStar}>★</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.status}>
                <img src={isActive ? trophyActive : trophyInactive} className={styles.trophy} />
                <span className={isActive ? styles.activeText : styles.inactiveText}>
                    {isActive ? "Активно!" : "Не активно"}
                </span>
            </div>
        </div>
    );
};

export default Reward;
