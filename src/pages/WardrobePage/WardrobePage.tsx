import React from "react";
import { WardrobeIcon } from "../../components/wardrobe/WardrobeIcon/WardrobeIcon";
import WardrobeTabs from "../../components/wardrobe/WardrobeTabs/WardrobeTabs";
import { WardrobeInfo } from "../../components/wardrobe/WardrobeInfo/WardrobeInfo";

import styles from './WardrobePage.module.scss';

export const WardrobePage: React.FC = () => {
    return (
        <div className={styles.wrp}>
            <WardrobeInfo/>
            <WardrobeIcon/>
            <WardrobeTabs/>
        </div>
    );
}