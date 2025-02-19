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
  IntegrationComment,
  IntegrationPageGuide,
  IntegrationStats,
  IntegrationStatsMini,
} from '../../components';
import integrationIcon from '../../assets/icons/integration-icon.svg';
import { useParams } from 'react-router-dom';
import { isGuideShown, setGuideShown } from '../../utils';
import { GUIDE_ITEMS } from '../../constants';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setActiveFooterItemId, setElevateIntegrationStats, setFooterActive } from '../../redux/slices/guideSlice';

export const IntegrationPage: React.FC = () => {
  const { t } = useTranslation('integrations');
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

  const { data, error, isLoading } = useGetIntegrationQuery(`${integrationId}`, { refetchOnMountOrArgChange: true });
  const {
    data: commentData,
    refetch,
  } = useGetUnansweredIntegrationCommentQuery(`${integrationId}`, { refetchOnMountOrArgChange: true });
  const [ postComment ] = usePostCommentIntegrationsMutation();

  const [ currentCommentIndex, setCurrentCommentIndex ] = useState<number>(0);
  const [ progress, setProgress ] = useState(0);
  const [ finished, setFinished ] = useState(false);

  const comments = commentData ? (Array.isArray(commentData) ? commentData : [ commentData ]) : [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveFooterItemId(1));
    dispatch(setFooterActive(true));
  }, []);

  useEffect(() => {
    if (comments.length === 0) {
      setFinished(true);
    }
  }, [ comments ]);

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

  console.log(data);

  return (
    <div className={styles.wrp}>
      <h1 className={styles.pageTitle}>{t('i1')}</h1>

      {isLoading && <p>{t('i3')}</p>}
      {(error || !integrationId) && <p>{t('i2')}</p>}

      {data?.status === 'published' && (
        <>
          <IntegrationStatsMini
            views={data.views}
            subscribers={data.subscribers}
            income={data.income}
          />
          <div className={styles.integrationNameWrp}>
            <p className={styles.integrationTitle}>{t('i1')} 1</p>
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
            <p className={styles.commentsSectionTitle}>{t('i4')}</p>
            <p className={styles.commentsAmount}>
              {comments.length === 0 ? 0 : currentCommentIndex + 1}/{comments.length}
            </p>
          </div>
          {commentData && <IntegrationComment
            progres={progress}
            {...comments[currentCommentIndex]}
            onVote={handleVote}
            hateText={commentData?.is_hate}
            finished={finished}
          />}
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
