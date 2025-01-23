import styles from './IntegrationComment.module.scss';

import coinIcon from '../../assets/icons/coin.svg';
import ProgressLine from './ProgressLine/ProgressLine';

interface IntegrationCommentProps {
    id: string;
    username: string;
    comment: string;
    isPositive: boolean;
    level: number;
    reward: number;
}

export const IntegrationComment: React.FC<IntegrationCommentProps> = ({ id, username, comment, isPositive, level, reward }) => {
    return (
        <div className={styles.wrp}>
            <div className={styles.usernameAndComment}>
                <p className={styles.username}>{username}:</p>
                {isPositive
                    ? <p className={styles.positiveCommentText}>{comment}</p>
                    : <p className={styles.negativeCommentText}>{comment}</p>
                }
            </div>
            <div className={styles.progressWrp}>
                <div className={styles.amountAndRewardWrp}>
                    <p className={styles.amount}>{level}/5</p>
                    <div className={styles.rewardWrp}>
                        <p className={styles.reward}>+{reward}</p>
                        <img src={coinIcon} />
                    </div>
                </div>
                <ProgressLine level={level} />
            </div>
            <div className={styles.thumbs}>
                <button className={styles.thumbsUp} />
                <button className={styles.thumbsDown} />
            </div>
        </div>
    )
}