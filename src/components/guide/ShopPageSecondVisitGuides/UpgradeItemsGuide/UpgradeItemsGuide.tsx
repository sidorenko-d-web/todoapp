import React, { useState } from "react";
import styles from './UpgradeItemsGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";

interface UpgradeItemsGuideProps {
    onClose: () => void;
}
export const UpgradeItemsGuide: React.FC<UpgradeItemsGuideProps> = ({onClose}) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        
        <Guide align="left"
            zIndex={110}
            top={'55%'}
            description={
                <>
                Не забывай прокачивать свои предмет! Твои интеграции будут приносить <span style={{color: '#EC7913'}}> еще больше наград!</span>
                <br />
                <br />
                А еще ты сможешь получать <span style={{color: '#E84949'}}>сундуки</span> и <span style={{color: '#9747FF'}}>новые образы </span> 
                для своих предметов, которые дают <span style={{color: '#2F80ED'}}>награды</span> и бустят твои интеграции!
                </>
            }
            onClose={onClose}>
            <button className={styles.nextBtn} onClick={handleClose}>Отлично!</button>
            <img src={img1} className={styles.gifImage} height={146} width={140}/>
        </Guide>
    );
};