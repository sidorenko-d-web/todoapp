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
        top={'5%'}
        description={
          <>
            Пуш-линия очень важна, так как от нее зависит сохранение твоего прогресса, а также твой доход!
            Только с активной Пуш-линией твои интеграции приносят деньги. Чтобы ее активировать достаточно сделать 1 интеграцию в день!
          </>
        }
        onClose={handleClose}>
        <button className={styles.nextBtn} onClick={handleClose}>{'Супер!'}</button>
        <img src={img1} className={styles.gifImage} height={146} width={140} />
      </Guide>
    </>
  );
};