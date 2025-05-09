import React, { useEffect, useState } from "react";
import styles from './IntegrationCreatedGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { setDimHeader } from "../../../../redux";
import { useModal } from "../../../../hooks";


interface IntegrationCreatedGuideProps {
  onClose: () => void;
}
export const IntegrationCreatedGuide: React.FC<IntegrationCreatedGuideProps> = ({ onClose }) => {
  const { t } = useTranslation('guide');
  const [isOpen, setIsOpen] = useState(true);

  useModal();
  const dispatch = useDispatch();

  useEffect(() => {
    //openModal(MODALS.DAYS_IN_A_ROW);
    dispatch(setDimHeader(false));
    localStorage.setItem('integrationCreatedGuideOpen', '1');
  }, []);

  const handleClose = () => {
    dispatch(setDimHeader(false));
    localStorage.setItem('integrationCreatedGuideOpen', '0');
    onClose();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (

    <Guide align="left"
      zIndex={11110}
      top={'65%'}
      dimBackground={false}
      description
      ={
        <>
          {t('g110')}<span style={{ color: '#2F80ED' }}>{t('g111')}</span> 
          {t('g39')} {t('g112')}
          <br/>
          <br/>
          {t('g113')}<span style={{ color: '#219653' }}>{t('g114')}</span> 
        </>
      }
      onClose={handleClose}>
      <button className={styles.nextBtn} onClick={handleClose}>{t('g7')}</button>
      <img src={img1} className={styles.gifImage} height={146} width={140} />
    </Guide>
  );
};