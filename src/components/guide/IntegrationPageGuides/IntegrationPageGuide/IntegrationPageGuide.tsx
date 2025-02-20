import React, { useState } from "react";
import styles from './IntegrationPageGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";
import { useTranslation } from 'react-i18next';

interface IntegrationPageGuideProps {
    onClose: () => void;
}
export const IntegrationPageGuide: React.FC<IntegrationPageGuideProps> = ({onClose}) => {
  const { t } = useTranslation('guide');
  const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        
        <Guide align="left"
            zIndex={110}
            top={'25%'}
            description= {
          <>
                <div style={{wordWrap: 'break-word',whiteSpace: 'pre-line'}}>
                  {t('g8')}
                <span style={{color: '#219653'}}> {t('g9')}</span>
                </div>
          </>
            }
            onClose={handleClose}>
            <button className={styles.nextBtn} onClick={handleClose}>{t('g10')}</button>
            <img src={img1} className={styles.gifImage} height={146} width={140}/>
        </Guide>
    );
};