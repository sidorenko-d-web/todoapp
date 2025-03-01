import React, { useState } from "react";
import styles from './IntegrationCreatedGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";
import { useTranslation } from 'react-i18next';

interface IntegrationCreatedGuideProps {
    onClose: () => void;
}
export const IntegrationCreatedGuide: React.FC<IntegrationCreatedGuideProps> = ({onClose}) => {
  const { t } = useTranslation('guide');
  const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        
        <Guide align="left"
            zIndex={11110}
            top={'55%'}
            description
            = {
                <>
                  {t('g5')}
                <br />
                <br />
                  {t('g6')}
                </>
            }
            onClose={onClose}>
            <button className={styles.nextBtn} onClick={handleClose}>{t('g7')}</button>
            <img src={img1} className={styles.gifImage} height={146} width={140}/>
        </Guide>
    );
};