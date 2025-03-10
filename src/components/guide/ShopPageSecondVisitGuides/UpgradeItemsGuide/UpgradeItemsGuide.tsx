import React, { useState } from "react";
import styles from './UpgradeItemsGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";
import { useTranslation } from 'react-i18next';

interface UpgradeItemsGuideProps {
    onClose: () => void;
}
export const UpgradeItemsGuide: React.FC<UpgradeItemsGuideProps> = ({onClose}) => {
  const { t } = useTranslation('guide');
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        
        <Guide align="left"
            zIndex={15000}
            top={'55%'}
            description={
                <>
                  {t('g57')} <span style={{color: '#EC7913'}}> {t('g58')}</span>
                <br />
                <br />
                  {t('g59')} <span style={{color: '#E84949'}}>{t('g60')}</span> {t('g39')} <span style={{color: '#9747FF'}}>{t('g61')} </span>
                  {t('g62')} <span style={{color: '#2F80ED'}}>{t('g63')}</span> {t('g64')}
                </>
            }
            onClose={onClose}>
            <button className={styles.nextBtn} onClick={handleClose}>{t('g17')}</button>
            <img src={img1} className={styles.gifImage} height={146} width={140}/>
        </Guide>
    );
};