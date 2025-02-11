import React, { useEffect, useState } from 'react';
import styles from './IntegrationPage.module.scss';
import {
  useGetIntegrationQuery,
  useGetIntegrationsQuery,
  useGetUnansweredIntegrationCommentQuery,
  usePostCommentIntegrationsMutation,
} from '../../redux';
import {
  Integration,
  IntegrationComment, IntegrationPageGuide,
  IntegrationStats,
  IntegrationStatsMini,
} from '../../components';
import integrationIcon from '../../assets/icons/integration-icon.svg';
import { useParams } from 'react-router-dom';
import { isGuideShown, setGuideShown } from '../../utils';
import { GUIDE_ITEMS } from '../../constants';
import { useDispatch } from 'react-redux';
import { setElevateIntegrationStats } from '../../redux/slices/guideSlice';

export const IntegrationPage: React.FC = () => {
  const { integrationId: queryIntegrationId } = useParams<{
    integrationId: string | undefined;
  }>();
  const { data: integrations } = useGetIntegrationsQuery(undefined, {
    skip: !!queryIntegrationId && queryIntegrationId !== 'undefined',
  });

  const integrationId =
    queryIntegrationId !== 'undefined'
      ? queryIntegrationId
      : integrations?.integrations[0].id;

  const { data, error, isLoading } = useGetIntegrationQuery(`${integrationId}`);
  const { data: commentData, refetch } = useGetUnansweredIntegrationCommentQuery(`${integrationId}`);
  const [postComment] = usePostCommentIntegrationsMutation();

  const [currentCommentIndex, setCurrentCommentIndex] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  const comments = commentData ? (Array.isArray(commentData) ? commentData : [commentData]) : [];

  const dispatch = useDispatch();


  useEffect(() => {
    if (comments.length === 0) {
      setFinished(true);
    }
  }, [comments]);

  const handleVote = async (isThumbsUp: boolean, commentId: string) => {
    await postComment({ commentId, isHate: isThumbsUp });

    setProgress(prevProgress => (prevProgress + 1) % 5);

    if (currentCommentIndex + 1 < comments.length) {
      setCurrentCommentIndex(prevIndex => prevIndex + 1);
    } else {
      setFinished(true);
      await refetch();
      setCurrentCommentIndex(0);
      setFinished(false);
    }
  };

  return (
    <div className={styles.wrp}>
      <h1 className={styles.pageTitle}>Интеграции</h1>

      {isLoading && <p>Загрузка...</p>}
      {(error || !integrationId) && <p>Интеграция не найдена</p>}

      {data?.status === 'created' && (
        <>
          <IntegrationStatsMini
            views={data.views}
            subscribers={data.subscribers}
            income={data.income}
          />
          <div className={styles.integrationNameWrp}>
            <p className={styles.integrationTitle}>Интеграция 1</p>
            <div className={styles.integrationLevelWrp}>
              <p className={styles.integrationLevel}>{data.campaign.company_name}</p>
              <img src={integrationIcon} height={12} width={12} />
            </div>
          </div>
          <Integration />
          <IntegrationStats
            views={data.views}
            income={data.income}
            subscribers={data.subscribers}
          />
          <div className={styles.commentsSectionTitleWrp}>
            <p className={styles.commentsSectionTitle}>Комментарии</p>
            <p className={styles.commentsAmount}>
              {comments.length === 0 ? 0 : currentCommentIndex + 1}/{comments.length}
            </p>
          </div>
          <IntegrationComment
            progres={progress}
            {...comments[currentCommentIndex]}
            onVote={handleVote}
            hateText={commentData?.is_hate}
            finished={finished}
          />
        </>

      )}
      {!isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN) &&
        <IntegrationPageGuide onClose={() => {
          setGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN);
          dispatch(setElevateIntegrationStats(false));
        }} />}
    </div>
  );
};
