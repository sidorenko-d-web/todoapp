import React, { useEffect, useState } from "react";
import styles from './ProfileFirstGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { setDimHeader } from "../../../../redux";

interface ProfileFirstGuideProps {
  onClose: () => void;
}
export const ProfileFirstGuide: React.FC<ProfileFirstGuideProps> = ({ onClose }) => {
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
        top={'49%'}
        description={
          <>
            Это твой профиль! Тут ты можешь видесь основные показатели своего аккаунта!
            Помимо просмотров и подписчиков тут также ты можешь увидеть свою позицию в рейтинге игроков и количество дней в Пушл-линии!
          </>
        }
        onClose={handleClose}>
        <button className={styles.nextBtn} onClick={handleClose}>{'Супер!'}</button>
        <img src={img1} className={styles.gifImage} height={146} width={140} />
      </Guide>
    </>
  );
};