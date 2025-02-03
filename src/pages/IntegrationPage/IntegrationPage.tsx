import React, { useState } from 'react';
import styles from './IntegrationPage.module.scss';
import { useParams } from 'react-router-dom';
import {
    useGetIntegrationQuery,
    useGetUnansweredIntegrationCommentQuery,
    usePostCommentIntegrationsMutation,
} from '../../redux';
import { Integration, IntegrationComment, IntegrationStats, IntegrationStatsMini } from '../../components';
import integrationIcon from '../../assets/icons/integration-icon.svg';

export const IntegrationPage: React.FC = () => {
    const { integrationId } = useParams<{ integrationId: string }>();
    const { data, error, isLoading } = useGetIntegrationQuery(`${integrationId}`);
    const { data: commentData, refetch } = useGetUnansweredIntegrationCommentQuery(`${integrationId}`);
    const [postComment] = usePostCommentIntegrationsMutation();

    const [currentCommentIndex, setCurrentCommentIndex] = useState<number>(0);
    const [progress, setProgress] = useState(0);

    const comments = commentData ? (Array.isArray(commentData) ? commentData : [commentData]) : [];

    const handleVote = async (isThumbsUp: boolean, commentId: string) => {
        await postComment({ commentId, isHate: isThumbsUp });
        await refetch();

        setProgress((prevProgress) => (prevProgress + 1) % 5);

        if (currentCommentIndex + 1 < comments.length) {
            setCurrentCommentIndex((prevIndex) => prevIndex + 1);
        } else {
            setCurrentCommentIndex(0);
        }
    };

    return (
      <div className={styles.wrp}>
          <h1 className={styles.pageTitle}>Интеграции</h1>

          {isLoading && <p>Загрузка...</p>}
          {error && <p>Интеграция не найдена</p>}

          {data && (
            <>
                <IntegrationStatsMini views={data.views} subscribers={data.subscribers} income={data.income} />
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
                    <p
                      className={styles.commentsAmount}>{comments.length === 0 ? 0 : currentCommentIndex + 1}/{comments.length}</p>
                </div>
            </>
          )}
            <IntegrationComment
              progress={progress}
              {...comments[currentCommentIndex]}
              onVote={handleVote}
            />
      </div>
    );
};
