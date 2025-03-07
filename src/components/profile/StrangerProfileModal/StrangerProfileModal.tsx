import { FC } from 'react';
import BottomModal from '../../shared/BottomModal/BottomModal';
import { ProfileInfo, ProfileStats, ProfileStatsMini, StreakCard } from '../../profile';
import goldMedal from '../../../assets/icons/medal-gold.svg';
import silverMedal from '../../../assets/icons/medal-silver.svg';
import bronzeMedal from '../../../assets/icons/medal-bronze.svg';
import { useGetUserProfileInfoByIdQuery } from '../../../redux';
import { useGetPushLineQuery } from '../../../redux';
import s from './StrangerProfileModal.module.scss';
import { useTranslation } from 'react-i18next';

interface StrangerProfileModalProps {
  modalId: string;
  onClose: () => void;
  profileId: string;
}

export const StrangerProfileModal: FC<StrangerProfileModalProps> = ({
  modalId,
  onClose,
  profileId,
}) => {
  const { t } = useTranslation('profile');
  const { data: profile } = useGetUserProfileInfoByIdQuery(profileId);
  const { data } = useGetPushLineQuery();
  const streaks = data?.week_information.filter(
    day =>
      day &&
      (day.status === 'unspecified' || day.status === 'passed') &&
      (day.is_notified_at_morning ||
        day.is_notified_at_afternoon ||
        day.is_notified_at_evening ||
        day.is_notified_at_late_evening ||
        day.is_notified_at_late_night ||
        day.is_notified_at_night),
  ).length;
  const { position, subscribers, daysInARow } = {
    position: 12,
    subscribers: 223567,
    daysInARow: streaks,
  };

  const rewardsData = [
    { name: 'Награда Mike', stars: 3, medal: 'gold' as const, isActive: true },
    { name: 'Награда Advdas', stars: 2, medal: 'silver' as const, isActive: false },
    { name: 'Награда Purna', stars: 1, medal: 'bronze' as const, isActive: false },
  ];

  const medalIcons = {
    gold: goldMedal,
    silver: silverMedal,
    bronze: bronzeMedal,
  };

  if (!profile) {
    return null;
  }

  return (
    <BottomModal
      modalId={modalId}
      title={`${t('p20')} ${profile.username}`}
      onClose={onClose}
    >
      <div className={s.content}>
        <ProfileStatsMini
          onlyBadges
          position={position}
          subscribers={subscribers}
          daysInARow={daysInARow ?? 0}
          totalViews={profile.total_views}
        />
        <ProfileInfo
          nickname={profile.username}
          blogName={profile.blog_name}
          subscriptionIntegrationsLeft={profile.subscription_integrations_left}
          position={position}
          nonEditable
        />
        <StreakCard streakDays={daysInARow ?? 0} onlyStreak />
        <ProfileStats
          earned={profile.total_earned}
          views={profile.total_views}
          favoriteCompany={'Favourite company'}
          comments={profile.comments_answered_correctly}
          rewards={profile.achievements_collected}
        />

        <div className={s.rewards}>
          {rewardsData.map((reward, index) => (
            <div className={s.rewardImage} key={index}>
              <img
                src={medalIcons[reward.medal]}
                alt={`${reward.medal} medal`}
                className={s.medal}
              />
            </div>
          ))}
        </div>
      </div>
    </BottomModal>
  );
};
