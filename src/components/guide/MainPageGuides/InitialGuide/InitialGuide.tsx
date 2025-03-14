import React, { useEffect, useState } from "react";
import styles from './InitialGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";
import { useTranslation } from 'react-i18next';

interface InitialGuideProps {
    onClose: () => void;
}
export const InitialGuide: React.FC<InitialGuideProps> = ({onClose}) => {
    const { t } = useTranslation('guide');
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        console.log('INITIAL GUIDE OPEN')
    }, []);


    const handleClose = () => {
        console.log('INITIAL GUIDE CLOSE')
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        
        <Guide align="left"
            zIndex={11110}
            top={'39%'}
            description={t('g31')}
            onClose={onClose}>
            <button className={styles.nextBtn} onClick={handleClose}>{t('g4')}</button>
            <img src={img1} className={styles.gifImage} height={146} width={140}/>
        </Guide>
    );
};