import coinIcon from '../../../assets/icons/coin.svg';
import ProgressLine from '../../shared/ProgressLine/ProgressLine';
import styles from './IntegrationComment.module.scss';
import classNames from 'classnames';

interface IntegrationCommentProps {
    author_username: string;
    comment_text: string;
    is_hate: boolean;
    id: string;
    progress: number;
    onVote: (isThumbsUp: boolean, id: string) => void;
}

interface IntegrationCommentProps {
  author_username: string;
  comment_text: string;
  is_hate: boolean;
  id: string;
  progress: number;
  onVote: (isThumbsUp: boolean, id: string) => void;
}

export const IntegrationComment: React.FC<IntegrationCommentProps> = ({
                                                                        author_username,
                                                                        comment_text,
                                                                        is_hate,
                                                                        id,
                                                                        progress,
                                                                        onVote,
                                                                      }) => {
  return (
    <div className={styles.wrp}>
      {comment_text ? (
        <div className={styles.usernameAndComment}>
          <p className={styles.username}>{author_username}:</p>
          <p className={classNames(styles.commentText, { [styles.commentHate]: is_hate })}>
            {comment_text}
          </p>
        </div>
      ) : (
        <p className={styles.noComment}>Нет новых комментариев</p>
      )}

      <div className={styles.progressWrp}>
        <div className={styles.amountAndRewardWrp}>
          <p className={styles.amount}>{progress}/5</p>
          <div className={styles.rewardWrp}>
            <p className={styles.reward}>+100</p>
            <img src={coinIcon} width={12} height={12} alt="coin" />
          </div>
        </div>
        <ProgressLine level={progress} color="blue" />
      </div>

      {comment_text && (
        <div className={styles.thumbs}>
          <button
            className={styles.thumbsUp}
            onClick={() => onVote(true, id)}
            aria-label="Thumbs Up"
          />
          <button
            className={styles.thumbsDown}
            onClick={() => onVote(false, id)}
            aria-label="Thumbs Down"
          />
        </div>
      )}
    </div>
  );
};
