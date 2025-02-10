import React, { useState } from "react";
import styles from './TreeGuide.module.scss';

import img1 from '../../../assets/gif/guide1.gif';
import { Guide } from "../Guide/Guide";

interface TreeGuideProps {
    onClose: () => void;
}
export const TreeGuide: React.FC<TreeGuideProps> = ({onClose}) => {
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
                <>
                <span style={{color: '#E0B01D'}}>Дерево роста</span> - это твой основной прогресс.
                С ростом подписчиков ты будешь достигать новые <span style={{color: '#E0B01D'}}>уровни Дерева</span>,
                а также более крутые <span style={{color: '#7A2BC3'}}>бонусы</span> и <span style={{color: '#E84949'}}>подарки</span>, 
                и открывать <span style={{color: '#2F80ED'}}>новые возможности!</span> Удачи!
                </>
            }
            onClose={handleClose}>
            <button className={styles.nextBtn} onClick={handleClose}>Отлично!</button>
            <img src={img1} className={styles.gifImage} height={146} width={140}/>
        </Guide>
    );
};