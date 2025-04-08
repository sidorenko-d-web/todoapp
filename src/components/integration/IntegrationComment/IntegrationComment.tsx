import useSound from 'use-sound';
import coinIcon from '../../../assets/icons/coin.png';
import { formatAbbreviation } from '../../../helpers';
import styles from './IntegrationComment.module.scss';
import { useSelector } from 'react-redux';
import { RootState, selectButtonVolume } from '../../../redux';
import { SOUNDS } from '../../../constants';
import { ProgressLine } from '../../shared';
import clsx from 'clsx';
import { TrackedButton } from '../..';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface IntegrationCommentProps {
  author_username: string;
  comment_text: string;
  comment_text_eng: string;
  id: string;
  progres: number;
  onVote: (isThumbsUp: boolean, id: string) => void;
  finished: boolean;
  hateText: boolean;
  isVoting: boolean;
}

export const IntegrationComment: React.FC<IntegrationCommentProps> = ({
  author_username,
  comment_text,
  comment_text_eng,
  id,
  progres,
  onVote,
  finished,
  hateText,
  isVoting,
}) => {
  const { t, i18n } = useTranslation('integrations');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  const [voteRightSound] = useSound(SOUNDS.rightAnswer, {
    volume: useSelector(selectButtonVolume) * 1.5,
  });
  const [voteWrongSound] = useSound(SOUNDS.wrongAnswer, {
    volume: useSelector(selectButtonVolume) * 1.5,
  });



  const [canShowComment, setCanShowComment] = useState(false);

  useEffect(() => {
    const lastTime = parseInt(localStorage.getItem("LAST_COMMENT_TIME_KEY") || '0');
    const now = Date.now();

    if (now - lastTime > 180_000 && !canShowComment) {
      setCanShowComment(true);
    }
    
    const checkInterval = setInterval(() => {
      const lastTime = parseInt(localStorage.getItem("LAST_COMMENT_TIME_KEY") || '0');
      const now = Date.now();

      if (now - lastTime > 180_000 && !canShowComment) {
        setCanShowComment(true);
      }
    }, 2000);

    return () => clearInterval(checkInterval);
  }, []);


  const handleVoteRight = () => {
    if (!isVoting && !finished) {
      localStorage.setItem("LAST_COMMENT_TIME_KEY", Date.now().toString());
      setTimeout(() => {
        setCanShowComment(false);
      }, 1000);
      onVote(true, id);
      voteRightSound();
    }
  };

  const handleVoteWrong = () => {
    if (!isVoting && !finished) {
      localStorage.setItem("LAST_COMMENT_TIME_KEY", Date.now().toString());
      setTimeout(() => {
        setCanShowComment(false);
      }, 1000);
      onVote(false, id);
      voteWrongSound();
    }
  };


  const commentGlow = useSelector((state: RootState) => state.guide.commentGlow);

  return (
    <div className={`${styles.wrp} ${commentGlow ? styles.elevated : ''}`} 
      style={!canShowComment ? {minHeight: '30px'} : {minHeight: '191px'}}>
      {!finished && canShowComment ? (
        <div className={styles.usernameAndComment}>
          <p className={styles.username}>{author_username}:</p>
          <p
            className={clsx({
              [styles.negativeCommentText]: hateText,
              [styles.positiveCommentText]: !hateText,
            })}
          >
            {locale === 'en' ? comment_text_eng : comment_text}
          </p>
        </div>
      ) : (
        <p className={styles.noComment}>{t('i8')}</p>
      )}
      {canShowComment &&  <div className={styles.progressWrp}>
        <div className={styles.amountAndRewardWrp}>
          <p className={styles.amount}>
            {progres}/{5}
          </p>
          <div className={styles.rewardWrp}>
            <p className={styles.reward}>+{formatAbbreviation(100, 'number', { locale: locale })}</p>
            <img src={coinIcon} width={18} height={18} />
          </div>
        </div>
        <ProgressLine level={progres} color="blue" />
      </div>}
      {canShowComment &&
        <div className={styles.thumbs}>
          <TrackedButton
            disabled={finished || isVoting}
            trackingData={{
              eventType: 'button',
              eventPlace: 'Лайк - Интеграции - Комментарий',
            }}
            className={styles.thumbsUp}
            onClick={handleVoteRight}
          />
          <TrackedButton
            disabled={finished || isVoting}
            trackingData={{
              eventType: 'button',
              eventPlace: 'Дизлайк - Интеграции - Комментарий',
            }}
            className={styles.thumbsDown}
            onClick={handleVoteWrong}
          />
        </div>}
    </div>
  );
};
