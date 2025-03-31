import { useEffect, useMemo, useState } from 'react';
import peeps from '../../../assets/icons/peeps.svg';
import piggy from '../../../assets/icons/piggy.svg';
import subscribersIcon from '../../../assets/icons/subscribers.png';
import s from './IncreaseIncome.module.scss';
import classNames from 'classnames';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants';
import { InviteFriend, UserReferrals } from '../Modal';
import { ReferralCard } from '../ReferralCard/ReferralCard';
import {
  useGetCurrentUsersReferralsQuery,
  useGetUserProfileInfoByIdQuery,
  UserProfileInfoResponseDTO,
} from '../../../redux';
import { formatAbbreviation } from '../../../helpers';
import { TrackedButton } from '../..';
import { useTranslation } from 'react-i18next';

// Вспомогательный хук для множественных запросов
const useMultipleProfileQueries = (profileIds: string[]) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return profileIds.map(profileId => useGetUserProfileInfoByIdQuery(profileId, { skip: !profileId }));
};

export const IncreaseIncome = () => {
  const { t, i18n } = useTranslation('promotion');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { openModal, closeModal } = useModal();

  // Получаем данные о рефералах
  const { data: referralsData, isLoading, error } = useGetCurrentUsersReferralsQuery();
  const referrals = referralsData?.referrals || [];
  const visibleReferrals = referrals.slice(0, 3);
  const visibleReferralsAll = referrals;
  const hiddenReferralsCount = referrals.length - 3;

  // Мемоизируем ID профилей
  const profileIdsAll = useMemo(
    () => visibleReferralsAll.map(referral => referral.character_data.profile_id),
    [visibleReferralsAll],
  );

  // Получаем данные профилей
  const profileQueries = useMultipleProfileQueries(profileIdsAll);
  const [profilesData, setProfilesData] = useState<UserProfileInfoResponseDTO[]>([]);

  // Обновляем данные профилей когда все запросы завершены
  useEffect(() => {
    const allLoaded = profileQueries.every(query => !query.isLoading && query.data);
    if (allLoaded) {
      const profiles = profileQueries.map(query => query.data!).filter(Boolean);
      setProfilesData(profiles);
    }
  // }, [profileQueries]); couses react error
}, []);

  // Считаем подписчиков
  const { totalSubscribers, subscribersForFirstLevel, subscribersForSecondLevel } = useMemo(() => {
    const subscribersForFirstLevel = profilesData.reduce(
      (sum, profile) => sum + (profile?.subscribers_for_first_level_referrals || 0),
      0,
    );
    const subscribersForSecondLevel = profilesData.reduce(
      (sum, profile) => sum + (profile?.subscribers_for_second_level_referrals || 0),
      0,
    );
    const totalSubscribers = subscribersForFirstLevel + subscribersForSecondLevel;
    return { totalSubscribers, subscribersForFirstLevel, subscribersForSecondLevel };
  }, [profilesData]);

  return (
    <>
      <h2 className={s.headerIncrease}>
        <span className={s.textName}>{t('p2')}</span>
        <span className={s.badge}>
          +{formatAbbreviation(totalSubscribers, 'number', { locale: locale })}{' '}
          <img src={peeps} alt="Количество peeps" />
        </span>
      </h2>
      <section className={s.wrapperIncrease}>
        <div className={s.content}>
          <img className={s.piggy} src={piggy} alt="Piggy Icon" />
          <div className={s.contentFriends}>
            <h3 className={s.nameFriends}>{t('p3')}</h3>
            <ul className={s.subscribers}>
              <li className={s.listBadge}>
                <span className={s.badge}>
                  +
                  {formatAbbreviation(subscribersForFirstLevel, 'number', {
                    locale: locale,
                  })}{' '}
                  <img src={subscribersIcon} alt="Подписчики" />
                </span>
                <span className={classNames(s.level, s.text)}>1{t('p4')}.</span>
              </li>
              <li className={s.listBadge}>
                <span className={s.badge}>
                  +{formatAbbreviation(subscribersForSecondLevel, 'number', { locale: locale })}{' '}
                  <img src={subscribersIcon} alt="Подписчики" />
                </span>
                <span className={classNames(s.level, s.text)}>2{t('p4')}.</span>
              </li>
            </ul>
          </div>
        </div>

        {isLoading && <p>{t('p18')}</p>}

        {error && <p>{t('p19')}</p>}

        {referralsData && (
          <>
            {referralsData.referrals.length > 0 ? (
              <div className={s.referralsList}>
                {visibleReferrals.map((referral, index) => (
                  <ReferralCard
                    key={index}
                    position={index + 1}
                    name={referral.username}
                    reminded_time={referral.reminded_at}
                    id_referral={referral.id}
                    profile_id={referral.character_data.profile_id}
                    total_invited={referral.total_invited}
                    streak={referral.push_line_data.in_streak_days}
                    days_missed={referral.push_line_data.failed_days_ago}
                  />
                ))}
                {hiddenReferralsCount > 0 && (
                  <p className={s.showMore}>
                    {t('p16')} {hiddenReferralsCount} {t('p17')}
                  </p>
                )}
              </div>
            ) : (
              <p className={s.noReferrals}>{t('p5')}</p>
            )}
          </>
        )}
        <div className={s.buttonsContainer}>
          <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: `${t('p6')} - ${t('p1')} - ${t('p15')}`,
            }}
            className={classNames(s.buttonContainer, s.text)}
            onClick={() => openModal(MODALS.INVITE_FRIEND)}
          >
            {t('p6')}
          </TrackedButton>
          {referralsData && referralsData.referrals.length > 1 && (
            <TrackedButton
              trackingData={{
                eventType: 'button',
                eventPlace: `${t('p7')} - ${t('p1')} - ${t('p15')}`,
              }}
              className={classNames(s.buttonContainerGray, s.text)}
              onClick={() => openModal(MODALS.USERS_REFERRALS)}
            >
              {t('p7')}
            </TrackedButton>
          )}
        </div>
        <InviteFriend modalId={MODALS.INVITE_FRIEND} onClose={() => closeModal(MODALS.INVITE_FRIEND)} />
        <UserReferrals modalId={MODALS.USERS_REFERRALS} onClose={() => closeModal(MODALS.USERS_REFERRALS)} />
      </section>
    </>
  );
};
