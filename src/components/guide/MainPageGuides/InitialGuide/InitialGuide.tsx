import React, { useEffect, useState } from 'react';
import styles from './InitialGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from '../../Guide/Guide';
import { useTranslation } from 'react-i18next';
import { isGuideShown } from '../../../../utils';
import { GUIDE_ITEMS } from '../../../../constants';
import { useDispatch } from 'react-redux';
import { setDimHeader } from '../../../../redux';

interface InitialGuideProps {
    onClose: () => void;
}
export const InitialGuide: React.FC<InitialGuideProps> = ({ onClose }) => {
    const { t } = useTranslation('guide');
    const [isOpen, setIsOpen] = useState(true);

    const [showGuide, setShowGuide] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowGuide(true);
            if(!isGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN)) {
                dispatch(setDimHeader(true));
            }
        }, 1200);
        return () => clearTimeout(timer);

    }, []);


    if (isGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN)) {
        return null;
    } 
    const handleClose = () => {
        //dispatch(setDimHeader(false));
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (

       <>
        {showGuide &&  <Guide align="left"
            zIndex={11110}
            top={'39%'}
            description={t('g31')}
            onClose={handleClose}>
            <button className={styles.nextBtn} onClick={handleClose}>{t('g4')}</button>
            <img src={img1} className={styles.gifImage} height={146} width={140} />
        </Guide>}
       </>
    );
};