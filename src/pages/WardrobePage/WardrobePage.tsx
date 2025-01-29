import React from "react";


import styles from './WardrobePage.module.scss';
import { WardrobeIcon, WardrobeInfo, WardrobeTabs } from "../../components";


export const WardrobePage: React.FC = () => {
    return (
        <div className={styles.wrp}>
            <WardrobeInfo/>
            <WardrobeIcon/>
            <WardrobeTabs/>
        </div>
    );
}