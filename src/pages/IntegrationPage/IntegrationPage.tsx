import React, { useEffect, useState } from 'react';
import styles from './IntegrationPage.module.scss';
import {
  setActiveFooterItemId,
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

  // console.log(integrations?.integrations.find(item))

  const integrationId = queryIntegrationId !== 'undefined' ? queryIntegrationId : integrations?.integrations.find(item => item.status === 'published')?.id;

  const {
    data,
    error,
    isLoading: isIntegrationLoading,
    refetch: refetchCurrentIntegration,
  } = useGetIntegrationQuery(`${integrationId}`, {
    refetchOnMountOrArgChange: true,
    // pollingInterval: 5 * 60 * 1000
    pollingInterval: 10 * 1000
  });


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

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveFooterItemId(1));
    dispatch(setFooterActive(true));
  }, []);

  const handleVote = async (isThumbsUp: boolean, commentId: string) => {
    const res = await postComment({ commentId, isHate: !isThumbsUp });
    await refetchCurrentIntegration();
    console.log(res.data ? 'угадано' : 'не угадано')
    if (currentCommentIndex + 1 < comments.length) {
      setCurrentCommentIndex(prevIndex => prevIndex + 1);
    } else {
      await refetch();
      setCurrentCommentIndex(0);
    }
  };

  const isLoading = (
    isIntegrationLoading ||
    isUnansweredIntegrationCommentLoading
  );

  if (isLoading) return <Loader />;

  return (
    <div className={styles.wrp}>
      <h1 className={styles.pageTitle}>{t('i1')}</h1>

      {isLoading && <p>{t('i3')}</p>}
      {(error || !integrationId) && <p>{t('i2')}</p>}

      {data  && (
        <>
          <IntegrationStatsMini
            views={data.views}
            subscribers={data.subscribers}
            income={data.income}
          />
          <div className={styles.integrationNameWrp}>
            <p className={styles.integrationTitle}>{t('i1')} {data.number}</p>
            <div className={styles.integrationLevelWrp}>
              <p className={styles.integrationLevel}>{data.campaign.company_name}</p>
              <img src={integrationIcon} height={16} width={16}  alt={'icon'}/>
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
              {data.comments_generated}/{20}
            </p>
          </div>
          {
            <IntegrationComment
              progres={data.comments_answered_correctly % 5}
              {...comments[currentCommentIndex]}
              onVote={handleVote}
              hateText={commentData?.is_hate}
              finished={data.comments_generated >= 20 || !(commentData && isSuccess)}
            />
          }
        </>
      )}
      {!isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN) && (
        <IntegrationPageGuide
          onClose={() => {
            setGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN);
            dispatch(setElevateIntegrationStats(false));
          }}
        />
      )}
    </div>
  );
};
