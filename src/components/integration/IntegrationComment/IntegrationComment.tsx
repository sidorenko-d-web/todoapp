import styles from './IntegrationComment.module.scss';

import coinIcon from '../../../assets/icons/coin.svg';
import ProgressLine from '../ProgressLine/ProgressLine';


interface IntegrationCommentProps {
    username: string;
    comment: string;
    isPositive: boolean;
    progres: number;
    onVote: (isThumbsUp: boolean) => void;
    finished: boolean;
}

export const IntegrationComment: React.FC<IntegrationCommentProps> = ({ username, comment, isPositive, progres, onVote, finished }) => {
    return (
        <div className={styles.wrp}>
            {!finished ? <div className={styles.usernameAndComment}>
                <p className={styles.username}>{username}:</p>
                {isPositive
                    ? <p className={styles.positiveCommentText}>{comment}</p>
                    : <p className={styles.negativeCommentText}>{comment}</p>
                }
            </div> : null}
            <div className={styles.progressWrp}>
                {finished ? <p className={styles.noComment}>Нет новых комментариев</p> : null}
                <div className={styles.amountAndRewardWrp}>
                    <p className={styles.amount}>{progres}/5</p>
                    <div className={styles.rewardWrp}>
                        <p className={styles.reward}>+100</p>
                        <img src={coinIcon} />
                    </div>
                </div>
                <ProgressLine level={progres} />
            </div>
            {!finished ? <div className={styles.thumbs}>
                <button className={styles.thumbsUp} onClick={() => onVote(true)} />
                <button className={styles.thumbsDown} onClick={() => onVote(false)} />
            </div> : null}
        </div>
    )
}