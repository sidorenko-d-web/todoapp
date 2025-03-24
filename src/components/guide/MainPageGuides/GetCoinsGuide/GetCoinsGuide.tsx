import React, { useEffect, useState } from 'react';
import styles from './GetCoinsGuide.module.scss';

import img1 from '../../../../assets/gif/guide4.gif';
import { Guide } from '../../Guide/Guide';

import coin from '../../../../assets/icons/coin.png';
// import { useGetUserQuery } from "../../../../redux";
import { useTranslation } from 'react-i18next';
import { setDimHeader } from '../../../../redux';
import { useDispatch } from 'react-redux';

interface GetCoinsGuideProps {
  onClose: () => void;

  welcomeBonus: string;
  refBonus: string;
}

export const GetCoinsGuide: React.FC<GetCoinsGuideProps> = ({ onClose, welcomeBonus, refBonus }) => {
  const { t } = useTranslation('guide');
  //const [ bonus, setBonus ] = useState('');
  //const [ refBonus, setRefBonus ] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setDimHeader(true));
    //dispatch(setDimHeader(true));
  }, []);


  // useEffect(() => {
  //   if (welcomeBonusData) {
  //     setBonus(welcomeBonusData.welcome_bonus);
  //     setRefBonus(welcomeBonusData.referrer_bonus);
  //   }
  // }, [ welcomeBonusData ]);

  const [ isOpen, setIsOpen ] = useState(true);

  const handleClose = () => {
    onClose();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {<Guide align="left"
                          zIndex={11110}
                          top={'35%'}
                          description={
                            <>
                              {t('g25')}
                              <br />
                              <br />
                              {t('g26')} <span style={{ color: '#E0B01D' }}>{welcomeBonus} {t('g26_1')}</span> {t('g26_2')}
                              <br />
                              <br />
                              {<span>{t('g27')} <span
                                style={{ color: '#E0B01D' }}>{refBonus} {t('g28')}</span> {t('g29')}</span>}
                            </>
                          }
                          onClose={handleClose}>
        <button className={styles.nextBtn} 
          onClick={handleClose}>{`${t('g30')} ${Number(welcomeBonus) + Number(refBonus)}`}<img src={coin} width={14}
                                                                                              height={14} /></button>
        <img src={img1} className={styles.gifImage} height={146} width={140} />
      </Guide>}
    </>
  );
};