import React, { useState } from 'react';

import styles from './IntegrationPage.module.scss';

import { useParams } from 'react-router-dom';

import { useGetIntegrationQuery } from '../../redux';
import { Integration, IntegrationComment, IntegrationStats, IntegrationStatsMini } from '../../components';

import integrationIcon from '../../assets/icons/integration-icon.svg';

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

    const { data, error, isLoading } = useGetIntegrationQuery(`${integrationId}`);

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

            {isLoading && <p>загрузка</p>}

            {error && <p>Интеграция не найдена</p>}

            {data && (
                <>
                    <IntegrationStatsMini views={data.views} subscribers={data.subscribers}/>

                    <div className={styles.integrationNameWrp}>
                        <p className={styles.integrationTitle}>Интеграция {data.campaign.company_name}</p>
                        <div className={styles.integrationLevelWrp}>
                            <p className={styles.integrationLevel}>Brilliant</p>
                            <img src={integrationIcon} height={12} width={12} />
                        </div>
                    </div>
                    <Integration />

                    <IntegrationStats views={data.views} income={data.income} subscribers={data.subscribers} />
                    <div className={styles.commentsSectionTitleWrp}>
                        <p className={styles.commentsSectionTitle}>Комментарии</p>
                        <p className={styles.commentsAmount}>{currentCommentIndex + 1}/{commentsData.length}</p>
                    </div>
                </>
            )}

            <IntegrationComment
                progres={progress}
                {...commentsData[currentCommentIndex]}
                onVote={handleVote}
                finished={finished}
            />
        </div>);
}
