import peeps from '../../../assets/icons/peeps.svg';
import piggy from '../../../assets/icons/piggy.svg';
import subscribersIcon from '../../../assets/icons/subscribers.png';
import goldCoinIcon from "../../../assets/Icons/coin.png"
import s from './IncreaseIncome.module.scss';
import classNames from 'classnames';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants';
import { InviteFriend, UserReferrals } from '../Modal';

import { ReferralCard } from '../ReferralCard/ReferralCard';
import {
  useGetCurrentUsersReferralsQuery,
} from '../../../redux';
import { formatAbbreviation } from '../../../helpers';
import { TrackedButton } from '../..';
import { useTranslation } from 'react-i18next';

export const IncreaseIncome = () => {
  const { t, i18n } = useTranslation('promotion');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { openModal, closeModal } = useModal();
  const { data: referralData, isLoading, error } = useGetCurrentUsersReferralsQuery();

  const referrals = referralData?.referrals || [];
  const visibleReferrals = referrals.slice(0, 3);
  const hiddenReferralsCount = referrals.length - 3;

  const sumSubscribers = (referralData?.main_statistics.subscribers_from_first_level ?? 0) + (referralData?.main_statistics.subscribers_from_second_level ?? 0)
  return (
    <>
      <h2 className={s.headerIncrease}>
        <span className={s.textName}>{t('p2')}</span>
        <span className={s.badge}>
          +{formatAbbreviation(sumSubscribers, 'number', { locale: locale })} <img src={peeps} alt="Количество peeps" />
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
                  {formatAbbreviation(referralData?.main_statistics.subscribers_from_first_level, 'number', {
                    locale: locale,
                  })}{' '}
                  <img src={subscribersIcon} alt="Подписчики" />
                </span>
                <span className={classNames(s.level, s.text)}>1{t('p4')}.</span>
              </li>
              <li className={s.listBadge}>
                <span className={s.badge}>
                  +{formatAbbreviation(referralData?.main_statistics.subscribers_from_second_level, 'number', { locale: locale })}{' '}
                  <img src={subscribersIcon} alt="Подписчики" />
                </span>
                <span className={classNames(s.level, s.text)}>2{t('p4')}.</span>
              </li>
              <li className={s.listBadge}>
                <span className={s.badge}>
                  +{formatAbbreviation(referralData?.main_statistics.points_from_first_level, 'number', { locale: locale })}{' '}
                  <img src={goldCoinIcon} alt="Поинты" />
                </span>
              </li>
            </ul>
          </div>
        </div>

        {isLoading && <p>{t('p18')}</p>}

        {error && <p>{t('p19')}</p>}
        
        {referralData && (
          <>
            {referralData.referrals.length > 0 ? (
              <div className={s.referralsList}>
                {visibleReferrals.map((referral, index) => (
                  <ReferralCard
                    key={index}
                    position={index + 1}
                    name={referral.username}
                    reminded_time={referral.reminded_at}
                    id_referral={referral.id}
                    total_invited={referral.invited_count}
                    streak={referral.push_line_data.in_streak_days}
                    days_missed={referral.push_line_data.failed_days_ago}
                    points_for_referrer={referral.points_for_referrer}
                    subscribers_for_referrer={referral.subscribers_for_referrer}
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
          {referralData && referralData.referrals.length > 1 && (
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
/*function useQueries(arg0: { queryKey: string[]; queryFn: () => any }[]) {
  throw new Error('Function not implemented.');
}

function fetchUserProfile(profile_id: never): any {
  throw new Error('Function not implemented.');
}*/
