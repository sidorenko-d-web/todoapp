import React, { useState } from "react";
import styles from "./WardrobeTabs.module.scss";

import { useGetInventorySkinsQuery } from "../../../redux/api/inventory/api";

import skinPlaceholder from '../../../assets/icons/skin-placeholder.svg';

const categories = [
    { name: "Голова", key: "head" },
    { name: "Лицо", key: "face" },
    { name: "Туловище", key: "upper_body" },
    { name: "Ноги", key: "legs" },
    { name: "Всё", key: "all" }
];

interface WardrobeTabsProps {
    setSelectedSkinUrl: (url: string) => void;
}

export const WardrobeTabs: React.FC<WardrobeTabsProps> = ({ setSelectedSkinUrl }) => {
    const { data: inventorySkinsData, isLoading } = useGetInventorySkinsQuery();
    const [activeTab, setActiveTab] = useState("Голова");
    const [selected, setSelected] = useState<string | null>(null);

    if (isLoading || !inventorySkinsData) {
        return <p>Loading skins...</p>;
    }

    const categorizedSkins = inventorySkinsData.skins.reduce((acc, skin) => {
        if (!acc[skin.wear_location]) acc[skin.wear_location] = [];
        acc[skin.wear_location].push(skin);
        return acc;
    }, {} as Record<string, typeof inventorySkinsData.skins>);

    categorizedSkins["all"] = inventorySkinsData.skins;

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                {categories.map(({ name, key }) => (
                    <button
                        key={key}
                        className={`${styles.tab} ${activeTab === name ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab(name)}
                    >
                        {name}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {categorizedSkins[categories.find(cat => cat.name === activeTab)?.key || "all"]?.map((skin) => (
                    <button
                        key={skin.id}
                        className={`${styles.option} ${selected === skin.id ? styles.selected : ""}`}
                        onClick={() => {
                            setSelected(skin.id);
                            setSelectedSkinUrl(skin.image_url);
                        }}
                    >
                         <img src={skin.image_url || skinPlaceholder} />
                    </button>
                ))}
            </div>
        </div>
    );
};
