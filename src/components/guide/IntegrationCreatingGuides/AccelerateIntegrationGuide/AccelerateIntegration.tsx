import React, { useEffect, useState } from "react";
import styles from './AccelerateIntegration.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { setDimHeader } from "../../../../redux";

interface AccelerateIntegtrationGuideProps {
  onClose: () => void;
}
export const AccelerateIntegtrationGuide: React.FC<AccelerateIntegtrationGuideProps> = ({ onClose }) => {
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

    <Guide align="right"
      zIndex={11110}
      top={'45%'}
      noButton={true}
      description={
        <>
          {t('g1')}
          <br />
          <br />
          {t('g2')} <span style={{ color: '#2F80ED' }}>{t('g3')}</span>
        </>
      }
      onClose={handleClose}>
      <button className={styles.nextBtn} onClick={handleClose}>{t('g4')}</button>
      <img src={img1} className={styles.gifImage} height={146} width={140} />
    </Guide>
  );
};