import React from 'react';
import BottomModal from '../../../shared/BottomModal/BottomModal';

import s from './UserReferrals.module.scss';
import subscribersIcon from '../../../../assets/icons/subscribers.png';

import { ReferralCard } from '../../ReferralCard/ReferralCard';
import {
  ReferralDTO,
  useGetCurrentUsersReferralsQuery,
} from '../../../../redux';
import { formatAbbreviation } from '../../../../helpers';
import { useTranslation } from 'react-i18next';

interface UserReferralsProps {
  modalId: string;
  onClose: () => void;
}

export const UserReferrals: React.FC<UserReferralsProps> = ({ modalId, onClose }: UserReferralsProps) => {
  const { t, i18n } = useTranslation('promotion');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  const { data, isLoading, error } = useGetCurrentUsersReferralsQuery();

  return (
    <BottomModal modalId={modalId} title={`${t('p32')}`} onClose={onClose}>
      <div className={s.badgesWrp} style={{ justifyContent: 'center' }}>
        <span className={s.badge}>
          <span>+{formatAbbreviation(data?.main_statistics.subscribers_from_first_level, 'number', { locale: locale })}</span>
          <img src={subscribersIcon} className={s.icon} alt="Подписчики"></img>
          <span className={s.level}>1{t('p4')}.</span>
        </span>
        <span className={s.badge}>
          <span className={s.value}>
            +{formatAbbreviation(data?.main_statistics.subscribers_from_second_level, 'number', { locale: locale })}
          </span>
          <img src={subscribersIcon} className={s.icon} alt="Подписчики"></img>
          <span className={s.level}>2{t('p4')}.</span>
        </span>
      </div>

      {isLoading && <p>{t('p34')}</p>}

      {error && <p>{t('p33')}</p>}

      {data && (
        <>
          {data.referrals.map((referral: ReferralDTO, index: number) => (
            <ReferralCard
              key={index}
              id_referral={referral.id}
              position={index + 1}
              name={referral.username}
              reminded_time={referral.reminded_at}
              total_invited={referral.invited_count}
              streak={referral.push_line_data.in_streak_days}
              days_missed={referral.push_line_data.failed_days_ago}
              points_for_referrer={referral.points_for_referrer}
              subscribers_for_referrer={referral.subscribers_for_referrer}
            />
          ))}

          {data.referrals.length === 0 && <p className={s.noReferrals}>{t('p35')}</p>}
        </>
      )}
    </BottomModal>
  );
};
