import React, { useEffect, useState } from "react";
import styles from "./WardrobePage.module.scss";
import { WardrobeIcon, WardrobeInfo, WardrobeTabs } from "../../components";
import { useDispatch } from "react-redux";
import { setActiveFooterItemId } from "../../redux";

export const WardrobePage: React.FC = () => {
    const [selectedSkinUrl, setSelectedSkinUrl] = useState<string | undefined>(undefined);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setActiveFooterItemId(-1));
    });

    return (
        <div className={styles.wrp}>
            <WardrobeInfo />
            <WardrobeIcon imageUrl={selectedSkinUrl} />
            <WardrobeTabs setSelectedSkinUrl={setSelectedSkinUrl} />
        </div>
    );
};
