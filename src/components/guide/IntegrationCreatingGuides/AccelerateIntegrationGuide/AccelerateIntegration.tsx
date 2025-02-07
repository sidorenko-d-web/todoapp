import React, { useState } from "react";
import styles from './AccelerateIntegration.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";

interface AccelerateIntegtrationGuideProps {
    onClose: () => void;
}
export const AccelerateIntegtrationGuide: React.FC<AccelerateIntegtrationGuideProps> = ({onClose}) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        
        <Guide align="left"
            zIndex={110}
            top={'45%'}
            description= {
                <>
                Отлично! Теперь нужно немного подождать пока интеграция будет создана. Но ты можешь повлиять на это!
                <br />
                <br />
                Тапни по экрану чтобы <span style={{color: '#2F80ED'}}>ускорить создание интеграции!</span>
                </>
            }
            onClose={onClose}>
            <button className={styles.nextBtn} onClick={handleClose}>Вперёд!</button>
            <img src={img1} className={styles.gifImage} height={146} width={140}/>
        </Guide>
    );
};