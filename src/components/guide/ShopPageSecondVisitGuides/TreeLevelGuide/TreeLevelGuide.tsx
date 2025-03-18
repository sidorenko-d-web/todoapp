import React, { useEffect, useState } from 'react';
import styles from './TreeLevelGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from '../../Guide';

import LockIcon from '../../../../assets/icons/lock_icon.svg';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setDimHeader } from '../../../../redux';


interface TreeLevelGuideProps {
    onClose: () => void;
}
export const TreeLevelGuide: React.FC<TreeLevelGuideProps> = ({ onClose }) => {
    const { t } = useTranslation('guide');
    const [isOpen, setIsOpen] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setDimHeader(true));
    }, []);

    const handleClose = () => {
        dispatch(setDimHeader(false));
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (

        <Guide align="left"
            zIndex={15000}
            top={'50%'}
            description={
                <>
                    <span style={{ color: '#2F80ED' }}>{t('g48')}</span> {t('g49')} <span style={{ color: '#E0B01D' }}> {t('g50')}</span>  {t('g51')}
                    <br />
                    <br />
                    {t('g52')} <span style={{ color: '#E0B01D' }}> {t('g53')}</span>. {t('g54')}
                </>
            }
            onClose={onClose}>
            <div className={`${styles.disabledUpgradeActions} ${styles.elevated}`}>
                <img src={LockIcon} alt="" />
                <p>{t('g55')} 7</p>
                <img src={LockIcon} alt="" />
            </div>
            <button className={styles.nextBtn} onClick={handleClose}>{t('g56')}</button>
            <img src={img1} className={styles.gifImage} height={146} width={140} />
        </Guide>
    );
};