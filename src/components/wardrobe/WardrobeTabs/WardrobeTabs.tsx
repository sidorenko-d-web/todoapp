import React, { useState } from "react";
import styles from "./WardrobeTabs.module.scss";

import skinPlacehoder from '../../../assets/icons/skin-placeholder.svg';

const categories = ["Голова", "Фото", "Видео", "Декор", "VIP"];
const options = Array(9).fill(null);

const WardrobeTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState("Голова");
    const [selected, setSelected] = useState(0);

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`${styles.tab} ${activeTab === category ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {options.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.option} ${selected === index ? styles.selected : ""}`}
                        onClick={() => setSelected(index)}
                    >
                        <img src={skinPlacehoder} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WardrobeTabs;
