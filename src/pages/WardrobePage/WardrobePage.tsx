import React, { useState } from "react";
import styles from "./WardrobePage.module.scss";
import { WardrobeIcon, WardrobeInfo, WardrobeTabs } from "../../components";

export const WardrobePage: React.FC = () => {
    const [selectedSkinUrl, setSelectedSkinUrl] = useState<string | undefined>(undefined);

    return (
        <div className={styles.wrp}>
            <WardrobeInfo />
            <WardrobeIcon imageUrl={selectedSkinUrl} />
            <WardrobeTabs setSelectedSkinUrl={setSelectedSkinUrl} />
        </div>
    );
};
