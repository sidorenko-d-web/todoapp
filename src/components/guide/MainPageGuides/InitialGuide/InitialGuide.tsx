import React, { useState } from "react";
import styles from './InitialGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";

interface InitialGuideProps {
    onClose: () => void;
}
export const InitialGuide: React.FC<InitialGuideProps> = ({onClose}) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        
        <Guide align="left"
            zIndex={110}
            top={'35%'}
            description="Меня зовут Push! Давай покажу, как тут все устроено и как ты сможешь заработать реальные деньги с Apusher! "
            onClose={onClose}>
            <button className={styles.nextBtn} onClick={handleClose}>Вперёд!</button>
            <img src={img1} className={styles.gifImage} height={146} width={140}/>
        </Guide>
    );
};