import React from "react";
import styles from "./WardrobeIcon.module.scss";

import profileIconPlaceholder from "../../../assets/icons/profile-icon-placeholder.svg";

interface WardrobeIconProps {
    imageUrl?: string;
}

export const WardrobeIcon: React.FC<WardrobeIconProps> = ({ imageUrl }) => {
    return (
        <div className={styles.wrp}>
            <img src={imageUrl || profileIconPlaceholder} width={45} height={60} alt="Wardrobe Icon" />
        </div>
    );
};
