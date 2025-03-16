import React, { useState } from "react";
import { Guide } from "../../Guide";

import styles from './WelcomeToShopGuide.module.scss';

import gif from '../../../../assets/gif/guide1.gif';
import { useTranslation } from 'react-i18next';


interface WelcomeToShopGuideProps {
    onClose: () => void;
}
export const WelcomeToShopGuide: React.FC<WelcomeToShopGuideProps> = ({ onClose }) => {
    const { t } = useTranslation('guide');
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <Guide
            description={
                <>
                    {t('g43')} <span style={{ color: '#2F80ED' }}>{t('g44')}</span> {t('g39')} <span style={{ color: '#EC7913' }}>{t('g45')}</span>. 
                    {t('g87')} <span style={{ color: '#E0B01D' }}>{t('g88')}</span> {t('g46')}
                    <br />
                    {t('g47')}
                </>
            }
            top={'50%'}
            onClose={handleClose}
        >
            <button className={styles.nextBtn} onClick={handleClose}>{t('g4')}</button>
            <img src={gif} className={styles.gifImage} />
        </Guide>
    )
}