import React, { useState } from "react";
import styles from './IntegrationPageGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";

interface IntegrationPageGuideProps {
    onClose: () => void;
}
export const IntegrationPageGuide: React.FC<IntegrationPageGuideProps> = ({onClose}) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        
        <Guide align="left"
            zIndex={110}
            top={'12%'}
            description= {
                <>
                Здесь находятся твои интеграции. 
                Ты можешь следить за их статистикой, а также взаимодействовать с подписчиками, 
                <span style={{color: '#219653'}}> отвечая на их комментарии!</span>
                </>
            }
            onClose={onClose}>
            <button className={styles.nextBtn} onClick={handleClose}>Супер!</button>
            <img src={img1} className={styles.gifImage} height={146} width={140}/>
        </Guide>
    );
};