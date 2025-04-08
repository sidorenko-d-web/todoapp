import { FC } from 'react';
import BottomModal from '../../shared/BottomModal/BottomModal';
import { ProfileInfo, ProfileStats, ProfileStatsMini, StreakCard } from '../../profile';
import goldMedal from '../../../assets/icons/medal-gold.svg';
import silverMedal from '../../../assets/icons/medal-silver.svg';
import bronzeMedal from '../../../assets/icons/medal-bronze.svg';
import { useGetPushLineQuery, useGetUserProfileInfoByIdQuery } from '../../../redux';
import s from './StrangerProfileModal.module.scss';
import { useTranslation } from 'react-i18next';

interface StrangerProfileModalProps {
  modalId: string;
  onClose: () => void;
  profileId: string;
}

export const StrangerProfileModal: FC<StrangerProfileModalProps> = ({ modalId, onClose, profileId }) => {
  const { t, i18n } = useTranslation('profile');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { data: profile } = useGetUserProfileInfoByIdQuery(profileId);
  const { data } = useGetPushLineQuery();
  const streaks = data?.week_information.filter(
    day => day && (day.push_line_data?.status === 'unspecified' || day.push_line_data?.status === 'passed'),
  ).length;
  const { position, daysInARow } = {
    position: 12,
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
    <BottomModal modalId={modalId} title={`${t('p20')} ${profile.username}`} onClose={onClose}>
      <div className={s.content}>
        <ProfileStatsMini onlyBadges position={position} daysInARow={daysInARow ?? 0} />
        <ProfileInfo
          nickname={profile.username}
          blogName={profile.blog_name}
          levelUser={profile.growth_tree_stage_id}
          subscriptionIntegrationsLeft={profile.subscription_integrations_left}
          position={position}
          nonEditable
        />
        <StreakCard
          streakDays={daysInARow ?? 0}
          onlyStreak
          chest={locale === 'ru' ? data?.next_chest.chest_name : data?.next_chest.chest_name_eng}
          status={
            locale === 'ru'
              ? data?.push_line_profile_status.status_name
              : data?.push_line_profile_status.status_name_eng
          }
        />
        <ProfileStats
          favoriteCompany={profile.favorite_company}
          comments={profile.comments_answered_correctly}
          rewards={profile.achievements_collected}
          views={profile.total_views}
        />

        <div className={s.rewards}>
          {rewardsData.map((reward, index) => (
            <div className={s.rewardImage} key={index}>
              <img src={medalIcons[reward.medal]} alt={`${reward.medal} medal`} className={s.medal} />
            </div>
          ))}
        </div>
      </div>
    </BottomModal>
  );
};
