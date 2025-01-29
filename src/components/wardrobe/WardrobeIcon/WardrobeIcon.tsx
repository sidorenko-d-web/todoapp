import React from "react";

import styles from './WardrobeIcon.module.scss';

import profileIconPlaceholder from '../../../assets/icons/profile-icon-placeholder.svg';


export const WardrobeIcon: React.FC = () => {
    return (
        <div className={styles.wrp}>
            <img src={profileIconPlaceholder} width={45} height={60}/>
        </div>
    );
}