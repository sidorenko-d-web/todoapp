import { FC } from 'react';
import cup from '../../../../assets/icons/cup.svg';
import clanRed from '../../../../assets/icons/clanRed.svg';
import s from './TopUsers.module.scss';
import fire from '../../../../assets/icons/fire.svg';
import close from '../../../../assets/icons/close-dark.svg';
import chest from '../../../../assets/icons/chest-purple.svg';
import classNames from 'classnames';
import BottomModal from '../../../shared/BottomModal/BottomModal.tsx';
import { useGetProfileMeQuery, useGetTopProfilesQuery } from '../../../../redux';
import { Link } from 'react-router-dom';
import { formatAbbreviation } from '../../../../helpers';
import clsx from 'clsx';

interface InviteFriendProps {
  modalId: string;
  onClose: () => void;
}

export const TopUsers: FC<InviteFriendProps> = ({
                                                  modalId,
                                                  onClose,
                                                }: InviteFriendProps) => {
  const { data } = useGetTopProfilesQuery();
  const topProfiles = data?.profiles || [];
  const { data: userProfileData } = useGetProfileMeQuery();

  const userPosition =
    userProfileData && topProfiles
      ? topProfiles.findIndex(
        (profile: { id: string }) => profile.id === userProfileData.id,
      )
      : -1;
  const position = userPosition !== -1 ? userPosition + 1 : topProfiles.length!;

  return (
    <BottomModal
      modalId={modalId}
      title={'Топ 10 000 инфлюенсеров'}
      onClose={onClose}
      titleIcon={cup}
    >
      <ul className={classNames(s.subscribers, s.ulBlock)}>
        <li className={s.listBadge}>
          <span className={s.badge}>
            {`#${position}`} <img src={clanRed} height={14} width={14} alt={'clanRed'} />
          </span>
        </li>
        <li className={s.listBadge}>
          <span className={classNames(s.badgeText, s.text)}>Осталось 3 д.</span>
        </li>
      </ul>
      <ul className={classNames(s.ulBlock, s.blogUsers)}>
        {topProfiles.map((profile, index) => (
          <Link
            to={`/profile/${profile.id}`}
            key={profile.id}
            className={classNames(s.listUser, userProfileData && userProfileData.id === profile.id && s.active)}
          >
            <div className={classNames(s.cardBlock)}>
              <div className={s.card}>
                {/*<img src={user} alt="user" width={27} height={36} />*/}
                <span className={clsx(s.avatarPosition, index + 1 <= 100 ? s.purple : '')}>#{index + 1}</span>
              </div>
            </div>
            <div className={s.userBlock}>
              <div className={s.userInfo}>
                <h3 className={s.text}>{profile.username}</h3>
                <ul className={classNames(s.ulBlock, s.infoRang)}>
                  <li className={s.number}>{formatAbbreviation(profile.growth_tree_stage_id ?? 0)}</li>
                  <li className={s.fireIcon}>
                    <img src={fire} alt="fire" width={14} height={14} />
                    <span>{formatAbbreviation(profile.days_in_streak)}</span>
                  </li>
                </ul>
              </div>
              <div className={s.numUser}>
                {`#${index + 1}`}
                <img src={clanRed} height={14} width={14} alt={'clanRed'} />
              </div>
            </div>
            <div className={classNames(s.cardBox)}>
              {index <= 100 ? (
                <img src={chest} height={20} width={20} alt="chest" />
              ) : (
                <img src={close} alt="close" width={20} height={20} />
              )}
            </div>
          </Link>
        ))}
      </ul>
    </BottomModal>
  );
};
