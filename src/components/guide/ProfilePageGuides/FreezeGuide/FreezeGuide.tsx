import React, { useEffect, useState } from "react";
import styles from './FreezeGuide.module.scss';

import img1 from '../../../../assets/gif/guide4.gif';
import { Guide } from "../../Guide/Guide";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { setDimHeader, setShowFreezeGuide } from "../../../../redux";

interface FreezeGuideProps {
    onClose: () => void;
}
export const FreezeGuide: React.FC<FreezeGuideProps> = ({ onClose }) => {
    const { t } = useTranslation('guide');
    const [isOpen, setIsOpen] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setDimHeader(true));
    }, []);

    const handleClose = () => {
        dispatch(setDimHeader(false));
        dispatch(setShowFreezeGuide(false));
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (

        <>
            <Guide align="right"
                noButton={true}
                zIndex={110}
                top={'21%'}
                description={
                    <>
                    {t('g97')}
                    <span style={{ color: '#2F80ED' }}>{t('g98')}</span> 
                    {t('g99')}
                    <br/>
                    {t('g100')}
                    <span style={{ color: '#56CCF2' }}>{t('g101')}</span> 
                    <br/>
                    {t('g102')}
                  </>
                }
                onClose={handleClose}>
                <button className={styles.nextBtn} onClick={handleClose}>{t('g109')}</button>
                <img src={img1} className={styles.gifImage} height={146} width={140} />
            </Guide>
        </>
    );
};