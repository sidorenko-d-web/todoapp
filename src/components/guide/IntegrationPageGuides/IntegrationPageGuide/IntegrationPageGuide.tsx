import React, { useEffect, useState } from 'react';
import styles from './IntegrationPageGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from '../../Guide';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setDimHeader } from '../../../../redux';
import { IntegrationComment, IntegrationStats } from '../../../integration';
import { setGuideShown } from '../../../../utils';
import { GUIDE_ITEMS } from '../../../../constants';

interface IntegrationPageGuideProps {
  onClose: () => void;
}
export const IntegrationPageGuide: React.FC<IntegrationPageGuideProps> = ({ onClose }) => {
  const { t } = useTranslation('guide');
  const [isOpen, setIsOpen] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setDimHeader(true));
  }, []);

  const handleClose = () => {
    setGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN);
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
        top={'20%'}
        description={
          <>
            <div style={{ wordWrap: 'break-word', whiteSpace: 'pre-line' }}>
              {t('g8')}
              <span style={{ color: '#219653' }}> {t('g9')}</span>
            </div>
          </>
        }
        onClose={handleClose}>
        <button className={styles.nextBtn} onClick={handleClose}>{t('g10')}</button>
        <img src={img1} className={styles.gifImage} height={146} width={140} />

        
      </Guide>

      <div style={{
        position: 'absolute',
        top: '50%',
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
        <div style={{ position: 'absolute', top: '64%',left: '4vw',
        width: '90vw', zIndex: '10000' }}>
          <IntegrationComment
            author_username="User1"
            isVoting={false}
            comment_text="Текст комментария" comment_text_eng="Comment text" id="123" progres={1}
            onVote={() => { console.log('vote') }} finished={false} hateText={false} />
        </div>
    </>
  );
};