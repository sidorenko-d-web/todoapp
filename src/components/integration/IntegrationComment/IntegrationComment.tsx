import { useSelector } from 'react-redux';
import coinIcon from '../../../assets/icons/coin.png';
import { formatAbbreviation } from '../../../helpers';
import ProgressLine from '../../shared/ProgressLine/ProgressLine';
import styles from './IntegrationComment.module.scss';
import { RootState } from '../../../redux';
import classNames from 'classnames';

interface IntegrationCommentProps {
  author_username: string;
  comment_text: string;
  id: string;
  progres: number;
  onVote: (isThumbsUp: boolean, id: string) => void;
  finished: boolean;
  hateText: boolean;
}

export const IntegrationComment: React.FC<IntegrationCommentProps> = ({
                                                                        author_username,
                                                                        comment_text,
                                                                        id,
                                                                        progres,
                                                                        onVote,
                                                                        finished,
                                                                        hateText
                                                                      }) => {


                                                                        
  const elevateComment = useSelector((state: RootState) => state.guide.elevateIntegrationStats);

  console.log(hateText);
  return (
    <div className={`${styles.wrp} ${elevateComment ? styles.elevated : ''}`}>
      {!finished ? (
        <div className={styles.usernameAndComment}>
          <p className={styles.username}>{author_username}:</p>
          <p className={classNames(styles.negativeCommentText, {[styles.positiveCommentText]: hateText})}>{comment_text}</p>
        </div>
      ) : <p className={styles.noComment}>Нет новых комментариев</p>}
      <div className={styles.progressWrp}>
        <div className={styles.amountAndRewardWrp}>
          <p className={styles.amount}>{progres}/5</p>
          <div className={styles.rewardWrp}>
            <p className={styles.reward}>+{formatAbbreviation(100)}</p>
            <img src={coinIcon} width={12} height={12} />
          </div>
        </div>
        <ProgressLine level={progres} color="blue" />
      </div>

      {!finished && (
        <div className={styles.thumbs}>
          <button className={styles.thumbsUp} onClick={() => onVote(true, id)} />
          <button className={styles.thumbsDown} onClick={() => onVote(false, id)} />
        </div>
      )}
    </div>
  );
};