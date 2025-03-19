import React, { useEffect, useState } from 'react';
import styles from './FinishTutorialGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from '../../Guide/Guide';
import { useTranslation } from 'react-i18next';
import { setGuideShown } from '../../../../utils';
import { GUIDE_ITEMS } from '../../../../constants';
import { useDispatch } from 'react-redux';
import { setDimHeader } from '../../../../redux';

interface FinishTutorialGuideProps {
    onClose: () => void;
}
export const FinishTutorialGuide: React.FC<FinishTutorialGuideProps> = ({ onClose }) => {
    const { t } = useTranslation('guide');
    const [isOpen, setIsOpen] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setDimHeader(true));
    }, []);

    const handleClose = () => {
        dispatch(setDimHeader(false));
        setGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN);
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (

        <Guide align="right"
            zIndex={11110}
            top={'53%'}
            description={
                <>{t('g32')}
                    <br />
                    <br />
                    {t('g33')} <span style={{ color: '#E0B01D' }}>{t('g34')}</span>! {t('g35')}
                </>
            }
            onClose={handleClose}>
            <button className={styles.nextBtn} onClick={handleClose}>{t('g36')}</button>
            <img src={img1} className={styles.gifImage} height={146} width={140} />
        </Guide>
    );
};
