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
  useGetProfileMeQuery,
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
import { GUIDE_ITEMS, MODALS } from '../../constants';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../hooks';
import GetRewardModal from '../DevModals/GetRewardModal/GetRewardModal';

export const IntegrationPage: React.FC = () => {
  const { t } = useTranslation('integrations');
  const { refetch: refetchMe } = useGetProfileMeQuery();
  const { integrationId: queryIntegrationId } = useParams<{
    integrationId: string | undefined;
  }>();
  const { data: integrations } = useGetIntegrationsQuery(undefined, {
    skip: !queryIntegrationId && queryIntegrationId === 'undefined',
  });

  const [ _, setRerender ] = useState(0);
  const [ localProgress, setLocalProgress ] = useState(0);
  const [ localCommentsGenerated, setLocalCommentsGenerated ] = useState(0);
  const [ isEndComment, setIsEndComment ] = useState(false);

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
    if (data) {
      setLocalCommentsGenerated(data.comments_answered_correctly);
    }
  }, [ data ]);

  useEffect(() => {
    if (!data) return;
    const refetchInterval = setInterval(() => {
      refetchCurrentIntegration();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refetchInterval);
  }, [ data, refetchCurrentIntegration ]);

  const {
    data: commentData,
    isLoading: isUnansweredIntegrationCommentLoading,
    refetch,
  } = useGetUnansweredIntegrationCommentQuery(`${integrationId}`, {
    refetchOnMountOrArgChange: true,
  });

  const [ postComment ] = usePostCommentIntegrationsMutation();

  const [ currentCommentIndex, setCurrentCommentIndex ] = useState<number>(0);
  const [ isVoting, setIsVoting ] = useState(false);

  const comments = commentData ? (Array.isArray(commentData) ? commentData : [ commentData ]) : [];

  const [ showGuide, setShowGuide ] = useState(false);

  const dispatch = useDispatch();

  const { openModal } = useModal();

  useEffect(() => {
    dispatch(setActiveFooterItemId(2));
  }, []);
  console.log(comments);
  useEffect(() => {
    if (data && !isUnansweredIntegrationCommentLoading && !isEndComment) {
      setIsEndComment(comments.length === 0);
    }
  }, [ data, comments, isUnansweredIntegrationCommentLoading ]);

  const handleVote = async (isThumbsUp: boolean, commentId: string) => {
    if (isVoting) return;
    setIsVoting(true);

    try {
      // Оптимистичное обновление
      const wasCorrect = isThumbsUp === !commentData?.is_hate;
      if (wasCorrect) {
        setLocalProgress(prev => (prev + 1) % 5);

        if (localProgress === 4) {
          openModal(MODALS.GET_REWARD);
        }
      }

      const response = await postComment({ commentId, isHate: !isThumbsUp });
      console.info('refetch');
      refetchMe();

      if (response.error) {
        setIsEndComment(true);
        throw new Error('Vote failed');
      }

      const answer = response.data;
      if (!answer) {
        setLocalProgress(0);
      }

      await refetchCurrentIntegration();

      if (currentCommentIndex + 1 < comments.length) {
        setCurrentCommentIndex(prevIndex => prevIndex + 1);
      } else {
        await refetch();
        setCurrentCommentIndex(0);
      }
    } catch (error) {
      console.error('Error handling vote:', error);
      setIsEndComment(true);
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(() => {
    if (data && !isIntegrationLoading) {
      const timer = setTimeout(() => {
        setShowGuide(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [ data, isIntegrationLoading ]);

  const isLoading = isIntegrationLoading || isUnansweredIntegrationCommentLoading;

  if (isLoading) return <Loader />;

  return (
    <div className={styles.wrp}>
      <GetRewardModal />
      <h1 className={styles.pageTitle}>{t('i1')}</h1>

      {error || !integrationId ? <p>{t('i2')}</p> : null}

      {data && (
        <>
          <IntegrationStatsMini />

          <div className={styles.container}>
            <div className={styles.integrationNameWrp}>
              <p className={styles.integrationTitle}>
                {t('i10')} {data.number}
              </p>
              <div className={styles.integrationLevelWrp}>
                <p className={styles.integrationLevel}>{data.campaign.company_name}</p>
                <img src={integrationIcon} height={16} width={16} alt="icon" />
              </div>
            </div>

            <Integration compaignImage={data.campaign.image_url} />

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
                  <p className={styles.commentsAmount}>
                    {localCommentsGenerated}
                    /20
                  </p>
                </div>
                <IntegrationComment
                  progres={localProgress}
                  {...comments[currentCommentIndex]}
                  onVote={handleVote}
                  hateText={comments[currentCommentIndex]?.is_hate}
                  finished={localCommentsGenerated >= 20 || isEndComment}
                  isVoting={isVoting}
                />
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
