import React, { useState } from "react";
import styles from "./WardrobeTabs.module.scss";

import { useGetInventorySkinsQuery } from "../../../redux/api/inventory/api";
import skinPlaceholder from '../../../assets/icons/skin-placeholder.svg';
import { IShopSkin } from "../../../redux";

const categories = [
    { name: "Голова", key: "head" },
    { name: "Лицо", key: "face" },
    { name: "Верх", key: "upper_body" },
    { name: "Низ", key: "lower_body" }, // Merged legs & feet
    { name: "VIP", key: "entire_body" }
];

type CategorizedSkins = {
    head: IShopSkin[];
    face: IShopSkin[];
    upper_body: IShopSkin[];
    lower_body: IShopSkin[];
    entire_body: IShopSkin[];
};

interface WardrobeTabsProps {
    setSelectedSkinUrl: (url: string) => void;
}

export const WardrobeTabs: React.FC<WardrobeTabsProps> = ({ setSelectedSkinUrl }) => {
    const { data: inventorySkinsData, isLoading } = useGetInventorySkinsQuery();
    const [activeTab, setActiveTab] = useState("head");
    const [selected, setSelected] = useState<string | null>(null);

    if (isLoading || !inventorySkinsData) {
        return <p>Loading skins...</p>;
    }

    const categorizedSkins: CategorizedSkins = {
        head: [],
        face: [],
        upper_body: [],
        lower_body: [],
        entire_body: [],
    };

    inventorySkinsData.skins.forEach((skin) => {
        if (skin.wear_location === "legs" || skin.wear_location === "feet") {
            categorizedSkins.lower_body.push(skin);
        } else if (skin.wear_location in categorizedSkins) {
            categorizedSkins[skin.wear_location as keyof CategorizedSkins].push(skin);
        }
    });

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                {categories.map(({ name, key }) => (
                    <button
                        key={key}
                        className={`${styles.tab} ${activeTab === key ? styles.activeTab : ""} ${(key === "entire_body" && activeTab !== key) ? styles.vipTab : ""}`}
                        onClick={() => setActiveTab(key)}
                    >
                        {name}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {categorizedSkins[activeTab as keyof CategorizedSkins]?.map((skin) => (
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
