import React, { useState } from 'react';
import styles from './TreeLevelGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from '../../Guide/Guide';

import LockIcon from '../../../../assets/icons/lock_icon.svg';
import { useTranslation } from 'react-i18next';


interface TreeLevelGuideProps {
    onClose: () => void;
}
export const TreeLevelGuide: React.FC<TreeLevelGuideProps> = ({onClose}) => {
    const [isOpen, setIsOpen] = useState(true);


    const { t } = useTranslation('shop');
    
    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        
        <Guide align="left"
            zIndex={110}
            top={'50%'}
            description={
                <>
               <span style={{color: '#2F80ED'}}>Новый уровень</span> открывается с каждым уровнем <span style={{color: '#E0B01D'}}> Дерева</span>  А уровень дерева зависит от подписчиков. 
               <br />
               <br />
               Чем больше у тебя подписчиков тем выше уровень <span style={{color: '#E0B01D'}}> дерева</span>. Давай, я тебе его покажу!
                </>
            }
            onClose={onClose}>
             <div className={`${styles.disabledUpgradeActions} ${styles.elevated}`}>
                <img src={LockIcon} alt="" />
                <p>{t('s18')} 7</p>
                <img src={LockIcon} alt="" />
            </div>
            <button className={styles.nextBtn} onClick={handleClose}>Дерево!</button>
            <img src={img1} className={styles.gifImage} height={146} width={140}/>
        </Guide>
    );
};