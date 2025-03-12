import React, { useState } from "react";
import styles from './GetCoinsGuide.module.scss';

import img1 from '../../../../assets/gif/guide4.gif';
import { Guide } from "../../Guide/Guide";

import coin from '../../../../assets/icons/coin.png';
import { useGetUserQuery } from "../../../../redux";
import { useTranslation } from 'react-i18next';

interface GetCoinsGuideProps {
    onClose: () => void;
}
export const GetCoinsGuide: React.FC<GetCoinsGuideProps> = ({ onClose }) => {
    const { t } = useTranslation('guide');
    const { data } = useGetUserQuery();

    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <>
            {true && <Guide align="left"
                zIndex={11110}
                top={'25%'}
                description={
                    <>
                        {t('g25')}
                        <br />
                        <br />
                        {t('g26')}
                        <br />
                        <br />
                        {data?.is_invited
                            && <span>{t('g27')} <span style={{ color: '#EC7913' }}>{t('g28')}</span> {t('g29')}</span>}
                    </>
                }
                onClose={onClose}>
                <button className={styles.nextBtn} onClick={handleClose}>{`${t('g30')} ${data?.is_invited ? '400' : '250'}`}<img src={coin} width={14} height={14} /></button>
                <img src={img1} className={styles.gifImage} height={146} width={140} />
            </Guide>}
        </>
    );
};