import React, { useEffect, useState } from 'react';
import styles from './IntegrationPage.module.scss';
import {
  setActiveFooterItemId,
  setDimHeader,
  setElevateIntegrationStats,
  setFooterActive,
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
  Loader,
} from '../../components';
import integrationIcon from '../../assets/icons/integration-icon.svg';
import { useParams } from 'react-router-dom';
import { isGuideShown, setGuideShown } from '../../utils';
import { GUIDE_ITEMS } from '../../constants';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

export const IntegrationPage: React.FC = () => {
  const { t } = useTranslation('integrations');
  const { integrationId: queryIntegrationId } = useParams<{
    integrationId: string | undefined;
  }>();
  const { data: integrations } = useGetIntegrationsQuery(undefined, {
    skip: !queryIntegrationId && queryIntegrationId === 'undefined',
  });

  const integrationId =
    queryIntegrationId !== 'undefined'
      ? queryIntegrationId
      : integrations?.integrations.find(item => item.status === 'published')?.id;

  const {
    data,
    error,
    isLoading: isIntegrationLoading,
    refetch: refetchCurrentIntegration,
  } = useGetIntegrationQuery(`${integrationId}`, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!data) return;
    const refetchInterval = setInterval(
      () => {
        refetchCurrentIntegration();
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(refetchInterval);
  }, [data, refetchCurrentIntegration]);

  const {
    data: commentData,
    isLoading: isUnansweredIntegrationCommentLoading,
    refetch,
    isSuccess,
  } = useGetUnansweredIntegrationCommentQuery(`${integrationId}`, {
    refetchOnMountOrArgChange: true,
  });
  const [postComment] = usePostCommentIntegrationsMutation();

  const [currentCommentIndex, setCurrentCommentIndex] = useState<number>(0);

  const comments = commentData ? (Array.isArray(commentData) ? commentData : [commentData]) : [];

  const [showGuide, setShowGuide] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveFooterItemId(1));
    dispatch(setFooterActive(true));
  }, []);

  const handleVote = async (isThumbsUp: boolean, commentId: string) => {
    await postComment({ commentId, isHate: !isThumbsUp });
    await refetchCurrentIntegration();

    if (currentCommentIndex + 1 < comments.length) {
      setCurrentCommentIndex(prevIndex => prevIndex + 1);
    } else {
      await refetch();
      setCurrentCommentIndex(0);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGuide(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  // useEffect(() => {
  //   window.scrollTo(0, document.body.scrollHeight);
  // }, []);

  const isLoading = isIntegrationLoading || isUnansweredIntegrationCommentLoading;

  if (isLoading) return <Loader />;

  return (
    <div className={styles.wrp}>
      <h1 className={styles.pageTitle}>{t('i1')}</h1>

      {isLoading && <p>{t('i3')}</p>}
      {(error || !integrationId) && <p>{t('i2')}</p>}

      {data && (
        <>
          <IntegrationStatsMini
            views={data.views}
            subscribers={data.subscribers}
            income={data.income}
            futureStatistics={data.future_statistics}
            lastUpdatedAt={data.updated_at}
          />
          <div className={styles.container}>
            <div className={styles.integrationNameWrp}>
              <p className={styles.integrationTitle}>{t('i1')} {data.number}</p>
              <div className={styles.integrationLevelWrp}>
                <p className={styles.integrationLevel}>{data.campaign.company_name}</p>
                <img src={integrationIcon} height={16} width={16} alt={'icon'} />
              </div>
            </div>
            <Integration />
            {isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN) &&
              <>
                <IntegrationStats
                  views={data.views}
                  income={data.income}
                  subscribers={data.subscribers}
                  futureStatistics={data.future_statistics}
                  lastUpdatedAt={data.updated_at}
                />
                <div className={styles.commentsSectionTitleWrp}>
                  <p className={styles.commentsSectionTitle}>{t('i4')}</p>
                  <p className={styles.commentsAmount}>
                    {data.comments_generated}/{20}
                  </p>
                </div>
                <IntegrationComment
                  progres={data.comments_answered_correctly % 5}
                  {...comments[currentCommentIndex]}
                  onVote={handleVote}
                  hateText={commentData?.is_hate}
                  finished={data.comments_generated >= 20 || !(commentData && isSuccess)}
                /></>
            }
          </div>
        </>
      )}
      {!isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN) && showGuide && (
        <IntegrationPageGuide
          onClose={() => {
            setGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN);
            dispatch(setElevateIntegrationStats(false));
            dispatch(setDimHeader(false));
          }}
        />
      )}
    </div>
  );
};
