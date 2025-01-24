import React, { useState } from 'react';

import styles from './IntegrationPage.module.scss';

import { useParams } from 'react-router-dom';

import subscribersIcon from '../../assets/icons/subscribers.svg';
import viewsIcon from '../../assets/icons/views.svg';
import coinIcon from '../../assets/icons/coin.svg';
import integrationIcon from '../../assets/icons/integration-icon.svg';
import integrationPlaceholder from '../../assets/icons/integration-placeholder.svg';

import { IntegrationComment } from '../../components/integration/IntegrationComment/IntegrationComment';


interface Comment {
    id: string;
    username: string;
    comment: string;
    isPositive: boolean;
}

const commentsData: Comment[] = [
    { id: '1', username: 'user1', comment: 'Great job!', isPositive: true },
    { id: '2', username: 'user2', comment: 'Not helpful...', isPositive: false },
    { id: '3', username: 'user3', comment: 'Loved it!', isPositive: true },
    { id: '4', username: 'user4', comment: 'Needs improvement.', isPositive: false },
    { id: '5', username: 'user5', comment: 'Great.', isPositive: true },
    { id: '6', username: 'user6', comment: 'Needs improvement.', isPositive: false },
    { id: '7', username: 'user7', comment: 'Cool.', isPositive: true },
];
export const IntegrationPage: React.FC = () => {
    const { integrationId } = useParams<{ integrationId: string }>();


    const [currentCommentIndex, setCurrentCommentIndex] = useState<number>(0);

    const [finished, setFinished] = useState(false);

    const [progress, setProgress] = useState(0);


    const handleVote = (isThumbsUp: boolean) => {
        if ((isThumbsUp && commentsData[currentCommentIndex].isPositive) || (!isThumbsUp && !commentsData[currentCommentIndex].isPositive)) {
            setProgress((prevProgress) => Math.min(prevProgress + 1, 5));
        }

        if (currentCommentIndex + 1 < commentsData.length) {
            setCurrentCommentIndex((prevIndex) => prevIndex + 1);
        } else {
            setFinished(true);
        }
    };

    return (
        <div className={styles.wrp}>
            <h1 className={styles.pageTitle}>Интеграции</h1>
            <div className={styles.statsUnderTitleWrp}>
                <div className={styles.toCenterStats} />
                <div className={styles.statsUnderTitle}>
                    <div className={styles.statWrp}>
                        <p className={styles.stat}>856,754 млн. </p>
                        <img src={viewsIcon} height={12} width={12} />
                    </div>

                    <div className={styles.statWrp}>
                        <p className={styles.stat}>223 567 </p>
                        <img src={subscribersIcon} height={12} width={12} />
                    </div>
                </div>
                <button className={styles.seeStatsButton}></button>
            </div>
            <div className={styles.integrationNameWrp}>
                <p className={styles.integrationTitle}>Интеграция {integrationId}</p>
                <div className={styles.integrationLevelWrp}>
                    <p className={styles.integrationLevel}>Brilliant</p>
                    <img src={integrationIcon} />
                </div>
            </div>

            <div className={styles.integration}>
                <img src={integrationPlaceholder} />
            </div>

            <div className={styles.IntegrationtatsWrp}>
                <div className={styles.Integrationtat}>
                    <p className={styles.amount}>223 567</p>
                    <div className={styles.typeWrp}>
                        <img src={subscribersIcon} />
                        <p className={styles.type}>  Подписчики</p>
                    </div>
                </div>
                <div className={styles.Integrationtat}>
                    <p className={styles.amount}>856,754 млн.</p>
                    <div className={styles.typeWrp}>
                        <img src={viewsIcon} />
                        <p className={styles.type}>Просмотры</p>
                    </div>
                </div>
                <div className={styles.Integrationtat}>
                    <p className={styles.amount}>223 567</p>
                    <div className={styles.typeWrp}>
                        <img src={coinIcon} />
                        <p className={styles.type}>Доход</p>
                    </div>
                </div>
            </div>
            <div className={styles.commentsSectionTitleWrp}>
                <p className={styles.commentsSectionTitle}>Комментарии</p>
                <p className={styles.commentsAmount}>{currentCommentIndex + 1}/{commentsData.length}</p>
            </div>

            <IntegrationComment
                progres={progress}
                {...commentsData[currentCommentIndex]}
                onVote={handleVote}
                finished={finished}
            />
        </div>);
}