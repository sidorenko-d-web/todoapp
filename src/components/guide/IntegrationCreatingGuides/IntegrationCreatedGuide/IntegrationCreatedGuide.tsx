import React, { useState } from "react";
import styles from './IntegrationCreatedGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";

interface IntegrationCreatedGuideProps {
    onClose: () => void;
}
export const IntegrationCreatedGuide: React.FC<IntegrationCreatedGuideProps> = ({onClose}) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        
        <Guide align="left"
            zIndex={110}
            top={'65%'}
            description
            = {
                <>
                Отлично! Это твои первые подписчики и первый доход!
                <br />
                <br />
                Давай посмотрим подробнее, как прошла первая интеграция!
                </>
            }
            onClose={onClose}>
            <button className={styles.nextBtn} onClick={handleClose}>Смотреть!</button>
            <img src={img1} className={styles.gifImage} height={146} width={140}/>
        </Guide>
    );
};