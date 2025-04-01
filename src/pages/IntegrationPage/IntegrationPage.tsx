import React, { useEffect, useState } from 'react';
import styles from './IntegrationPage.module.scss';
import {
  setActiveFooterItemId,
  setCommentGlow,
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
  IntegrationStatsGuide,
  IntegrationStatsMini,
  Loader,
} from '../../components';
import integrationIcon from '../../assets/icons/integration-icon.svg';
import { useParams } from 'react-router-dom';
import { isGuideShown, setGuideShown } from '../../utils';
import { GUIDE_ITEMS } from '../../constants';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const REFETCH_INTERVAL = 5 * 60 * 1000;

export const IntegrationPage: React.FC = () => {
  const { t } = useTranslation('integrations');
  const { integrationId: queryIntegrationId } = useParams<{
    integrationId: string | undefined;
  }>();
  const { data: integrations } = useGetIntegrationsQuery(undefined, {
    skip: !queryIntegrationId && queryIntegrationId === 'undefined',
  });

  const [_, setRerender] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);
  const [localCommentsGenerated, setLocalCommentsGenerated] = useState(0);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);
  const [lastRefetchTime, setLastRefetchTime] = useState<number>(Date.now());

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
    pollingInterval: REFETCH_INTERVAL,
  });

  const {
    data: commentData,
    isLoading: isUnansweredIntegrationCommentLoading,
    refetch: refetchComments,
  } = useGetUnansweredIntegrationCommentQuery(`${integrationId}`, {
    refetchOnMountOrArgChange: true,
    pollingInterval: REFETCH_INTERVAL,
  });

  const [postComment] = usePostCommentIntegrationsMutation();
  const [isVoting, setIsVoting] = useState(false);
  const comments = commentData ? (Array.isArray(commentData) ? commentData : [commentData]) : [];
  const [showGuide, setShowGuide] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveFooterItemId(2));
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      const serverProgress = data.comments_answered_correctly;
      const calculatedProgress = serverProgress % 5;
      const calculatedIndex = Math.floor(serverProgress / 5) % Math.max(1, comments.length);

      setLocalProgress(calculatedProgress);
      setCurrentCommentIndex(calculatedIndex);
      setLocalCommentsGenerated(data.comments_generated);

      console.log(`Server: ${serverProgress}, Progress: ${calculatedProgress}, Index: ${calculatedIndex}`);
    }
  }, [data, comments.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastRefetchTime >= REFETCH_INTERVAL) {
        console.log('Auto-refreshing data and comments...');
        refetchCurrentIntegration();
        refetchComments();
        setLastRefetchTime(now);
      }
    }, REFETCH_INTERVAL);

    return () => clearInterval(interval);
  }, [lastRefetchTime, refetchCurrentIntegration, refetchComments]);

  useEffect(() => {
    if (!data) return;
    const timer = setTimeout(() => {
      refetchCurrentIntegration();
      refetchComments();
    }, REFETCH_INTERVAL);
    return () => clearTimeout(timer);
  }, [data, refetchCurrentIntegration, refetchComments]);

  const handleVote = async (isThumbsUp: boolean, commentId: string) => {
    if (isVoting || localCommentsGenerated >= 20) return;
    setIsVoting(true);

    try {
      const tempProgress = (localProgress + 1) % 5;
      setLocalProgress(tempProgress);
      setLocalCommentsGenerated(prev => prev + 1);

      await postComment({ commentId, isHate: !isThumbsUp }).unwrap();

      const { data: updatedData } = await refetchCurrentIntegration();
      await refetchComments();
      setLastRefetchTime(Date.now());

      if (updatedData) {
        const serverProgress = updatedData.comments_answered_correctly;
        const newProgress = serverProgress % 5;
        const newIndex = Math.floor(serverProgress / 5) % Math.max(1, comments.length);

        setLocalProgress(newProgress);
        setCurrentCommentIndex(newIndex);
        setLocalCommentsGenerated(updatedData.comments_generated);
      }
    } catch (error) {
      console.error('Vote failed:', error);
      // Откат при ошибке
      if (data) {
        setLocalProgress(data.comments_answered_correctly % 5);
        setLocalCommentsGenerated(data.comments_generated);
      }
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(() => {
    if (data && !isIntegrationLoading) {
      const timer = setTimeout(() => setShowGuide(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [data, isIntegrationLoading]);

  const isLoading = isIntegrationLoading || isUnansweredIntegrationCommentLoading;

  if (isLoading) return <Loader />;

  return (
    <div className={styles.wrp}>
      <h1 className={styles.pageTitle}>{t('i1')}</h1>

      {error || !integrationId ? <p>{t('i2')}</p> : null}

      {data && (
        <>
          <IntegrationStatsMini />

          <div className={styles.container}>
            <div className={styles.integrationNameWrp}>
              <p className={styles.integrationTitle}>
                {t('i1')} {data.number}
              </p>
              <div className={styles.integrationLevelWrp}>
                <p className={styles.integrationLevel}>{data.campaign.company_name}</p>
                <img src={integrationIcon} height={16} width={16} alt="icon" />
              </div>
            </div>

            <Integration />

            {isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_STATS_GUIDE_SHOWN) && (
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
                  <p className={styles.commentsAmount}>{localCommentsGenerated}/20</p>
                  <p className={styles.refreshInfo}>
                    {t('commentsRefreshIn')} {Math.floor((REFETCH_INTERVAL - (Date.now() - lastRefetchTime)) / 60000)}{' '}
                    {t('minutes')}
                  </p>
                </div>

                {comments.length > 0 && currentCommentIndex < comments.length && (
                  <IntegrationComment
                    progres={localProgress}
                    {...comments[currentCommentIndex]}
                    onVote={handleVote}
                    hateText={comments[currentCommentIndex]?.is_hate}
                    finished={localCommentsGenerated >= 20}
                    isVoting={isVoting}
                  />
                )}
              </>
            )}
          </div>
        </>
      )}

      {!isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN) && showGuide && (
        <IntegrationPageGuide
          onClose={() => {
            setGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN);
            dispatch(setFooterActive(true));
            dispatch(setCommentGlow(false));
            dispatch(setActiveFooterItemId(2));
            dispatch(setElevateIntegrationStats(false));
            dispatch(setDimHeader(false));
            setRerender(prev => prev + 1);
          }}
        />
      )}

      {!isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_STATS_GUIDE_SHOWN) &&
        isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN) && (
          <IntegrationStatsGuide
            onClose={() => {
              setGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_STATS_GUIDE_SHOWN);
              dispatch(setFooterActive(true));
              dispatch(setCommentGlow(false));
              dispatch(setActiveFooterItemId(2));
              dispatch(setElevateIntegrationStats(false));
              dispatch(setDimHeader(false));
              setRerender(prev => prev + 1);
            }}
          />
        )}
    </div>
  );
};
