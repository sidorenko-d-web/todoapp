import React, { useEffect, useState } from "react";
import styles from './PushLineGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { setDimHeader } from "../../../../redux";

interface PushLineGuideProps {
  onClose: () => void;
}
export const PushLineGuide: React.FC<PushLineGuideProps> = ({ onClose }) => {
  const { t } = useTranslation('guide');
  const [isOpen, setIsOpen] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setDimHeader(true));
  }, []);

  const handleClose = () => {
    //dispatch(setDimHeader(false));
    onClose();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (

    <>
      <Guide align="left"
        noButton={true}
        zIndex={110}
        top={'21%'}
        description={
          <>
            {t('g92')}<span style={{ color: '#2F80ED' }}>{t('g93')}</span>
            {t('g94')}<span style={{ color: '#EC7913' }}>{t('g94_2')}</span>
            <br/>
            <br/>
            {t('g95')}<span style={{ color: '#2F80ED' }}>{t('g96')}</span>
          </>
        }
        onClose={handleClose}>
        <button className={styles.nextBtn} onClick={handleClose}>{t('g107')}</button>
        <img src={img1} className={styles.gifImage} height={146} width={140} />
      </Guide>
    </>
  );
};