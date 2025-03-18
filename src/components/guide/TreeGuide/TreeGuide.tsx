import React, { useEffect, useState } from "react";
import styles from './TreeGuide.module.scss';

import img1 from '../../../assets/gif/guide1.gif';
import { Guide } from '../Guide';

import gift from '../../../assets/icons/gift.svg';
import cup from '../../../assets/icons/medal-gold.svg';
import home from '../../../assets/icons/colored-home.svg';
import { useTranslation } from 'react-i18next';
import { formatAbbreviation } from '../../../helpers';
import { useDispatch } from "react-redux";
import { setDimHeader } from "../../../redux";


interface TreeGuideProps {
    onClose: () => void;
}
export const TreeGuide: React.FC<TreeGuideProps> = ({ onClose }) => {
    const { t, i18n } = useTranslation('guide');
    const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
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

        <Guide align="right"
            zIndex={110}
            top={'55%'}
            description={
                <>
                    <span style={{ color: '#E0B01D' }}>{t('g65')}</span> {t('g66')}
                    {t('g67')} <span style={{ color: '#E0B01D' }}>{t('g68')}</span>,
                    {t('g69')} <span style={{ color: '#7A2BC3' }}>{t('g70')}</span> {t('g39')} <span style={{ color: '#E84949' }}>{t('g71')}</span>,
                    {t('g72')} <span style={{ color: '#2F80ED' }}>н{t('g73')}</span> {t('g35')}
                </>
            }
            onClose={handleClose}>
            <div style={{ position: 'absolute', top: '-165px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div className={styles.square}><img src={gift} width={20} height={20}></img></div>
                    <div className={styles.square}><img src={cup} width={20} height={20}></img></div>
                    <div className={styles.square}><img src={home} width={20} height={20}></img></div>
                </div>
                <div className={styles.subscribers}>
                    <p style={{ height: '10px', marginBottom: '5px' }}>{formatAbbreviation(100000, 'number', { locale: locale })}</p>
                    <p>{t('g44')}</p>
                </div>
            </div>
            <button className={styles.nextBtn} onClick={handleClose}>{t('g17')}</button>
            <img src={img1} className={styles.gifImage} height={146} width={140} />
        </Guide>
    );
};