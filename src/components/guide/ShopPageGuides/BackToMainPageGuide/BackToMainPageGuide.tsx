import React, { useState } from "react";
import { Guide } from "../../Guide";

import styles from './BackToMainPageGuide.module.scss';

import gif from '../../../../assets/gif/guide1.gif';
import { setGuideShown } from "../../../../utils";
import { GUIDE_ITEMS } from "../../../../constants";
import { useDispatch } from "react-redux";
import { setCreateIntegrationButtonGlowing, setDimHeader } from "../../../../redux/slices/guideSlice";
import { useTranslation } from 'react-i18next';


interface BackToMainPageGuideProps {
    onClose: () => void;
}
export const BackToMainPageGuide: React.FC<BackToMainPageGuideProps> = ({ onClose }) => {
    const { t } = useTranslation('guide');
    const [isOpen, setIsOpen] = useState(true);


    const dispatch = useDispatch();

    const handleClose = () => {
        setGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE);
        dispatch(setCreateIntegrationButtonGlowing(true));
        dispatch(setDimHeader(false));
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;


    return (
        <Guide
            align="right"
            description={
                <>
                {t('g37')}<span style={{ color: '#2F80ED' }}>{t('g38')}</span> {t('g39')} <span style={{ color: '#2F80ED' }}>{t('g40')}</span>.
                    <br />
                    <br />
                    {t('g41')}
                </>
            }
            zIndex={15000}
            top={'50%'}
            onClose={handleClose}
        >
            <button className={styles.nextBtn} onClick={handleClose}>{t('g42')}</button>
            <img src={gif} className={styles.gifImage} />
        </Guide>
    )
}