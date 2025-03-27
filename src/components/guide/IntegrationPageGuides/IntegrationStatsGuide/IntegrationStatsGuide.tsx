import React, { useEffect, useState } from "react";
import styles from './IntegrationStatsGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { setDimHeader } from "../../../../redux";
import { IntegrationStats } from "../../../integration";

interface IntegrationStatsGuideProps {
  onClose: () => void;
}
export const IntegrationStatsGuide: React.FC<IntegrationStatsGuideProps> = ({ onClose }) => {
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
      <Guide align="right"
        noButton={true}
        zIndex={110}
        top={'57%'}
        description={
          <>
            {t('g103')}<span style={{ color: '#2F80ED' }}>{t('g104')}</span> 
            <br/>
            {t('g105')}<span style={{ color: '#E84949' }}>{t('g106')}</span> 
          </>
        }
        onClose={handleClose}>
        <button className={styles.nextBtn} onClick={handleClose}>{t('g107')}</button>
        <img src={img1} className={styles.gifImage} height={146} width={140} />


      </Guide>
      <div style={{
        position: 'absolute',
        top: '53%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90vw',
        display: 'flex',
        zIndex: '10000',

        justifyContent: 'center'
      }}>
        <IntegrationStats
          views={1234}
          income={"56789"}
          subscribers={12345}
          futureStatistics={{ subscribers: 1235, views: 12415351, income: "121252" }}
          lastUpdatedAt={"01.01.1970"}
        />

      </div>

    </>
  );
};