import React, { useState } from "react";
import styles from './FinishTutorialGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";

interface FinishTutorialGuideProps {
    onClose: () => void;
}
export const FinishTutorialGuide: React.FC<FinishTutorialGuideProps> = ({onClose}) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        
        <Guide align="right"
            zIndex={110}
            top={'55%'}
            description={
                <>Вот ты и настоящий блогер! Продолжай делать интеграции с брендами, привекать подписчиков и зарабатывать! 
                <br />
                <br />
                И помни, чем больше монет ты накопишь тем лучше, ведь позже их можно будет 
                конвертировать в <span style={{color: '#E0B01D'}}>РЕАЛЬНЫЕ ДЕНЬГИ</span>! Удачи!
                </>
            }
            onClose={onClose}>
            <button className={styles.nextBtn} onClick={handleClose}>Завершить обучение</button>
            <img src={img1} className={styles.gifImage} height={146} width={140}/>
        </Guide>
    );
};