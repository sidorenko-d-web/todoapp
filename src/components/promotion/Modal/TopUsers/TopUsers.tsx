import { FC } from 'react';
import cup from '../../../../assets/icons/cup.svg';
import clanRed from '../../../../assets/icons/clanRed.svg';
import s from './TopUsers.module.scss';
import fire from '../../../../assets/icons/fire.svg';
import user from '../../../../assets/icons/user.svg';
import close from '../../../../assets/icons/close.svg';
import classNames from 'classnames';
import BottomModal from '../../../shared/BottomModal/BottomModal.tsx';
import { useGetTopProfilesQuery } from '../../../../redux/index.ts';
import { Link } from 'react-router-dom';

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

  // TODO: Раскомментировать когда на бэке будет vip данные
  return (
    <BottomModal modalId={modalId} title={'Топ 10 000 инфлюенсеров'} onClose={onClose} titleIcon={cup}>
      <ul className={classNames(s.subscribers, s.ulBlock)}>
        <li className={s.listBadge}>
            <span className={s.badge}>
             #345 <img src={clanRed} height={14} width={14} alt={'clanRed'} />
            </span>
        </li>
        <li className={s.listBadge}>
            <span className={classNames(s.badgeText, s.text)}>
              Осталось 3 д.
            </span>
        </li>
      </ul>
      <ul className={classNames(s.ulBlock, s.blogUsers)}>
        {topProfiles.map(profile => (
          <Link to={`/profile/${profile.id}`} key={profile.id} className={s.listUser}>
            <div
              className={classNames(s.cardBlock, {/*{ [s.vipCard]: profile.vip }*/ })}>
              <div className={s.card}>
                <img src={user} alt="user" width={27} height={36} />
              </div>
            </div>
            <div className={s.userBlock}>
              <div className={s.userInfo}>
                <h3 className={s.text}>{profile.username}</h3>
                <ul className={classNames(s.ulBlock, s.infoRang)}>
                  <li className={s.number}>6</li>
                  <li className={s.fireIcon}>
                    <img src={fire} alt="fire" width={12} height={12} />
                    <span>{profile.points}</span>
                  </li>
                  {/*{profile.vip &&*/}
                  {/*  <li className={s.vip}>*/}
                  {/*    <img src={star} alt="star" width={12} height={12} />*/}
                  {/*    <span>VIP</span>*/}
                  {/*  </li>}*/}
                </ul>
              </div>
              <div className={s.numUser}>
                #122 <img src={clanRed} height={14} width={14} alt={'clanRed'} />
              </div>
            </div>
            <div className={classNames(s.cardBox, {/*{ [s.vipCardBox]: profile.vip }*/ })}>
              {/*{profile.vip ? <img src={chest} height={20} width={20} alt="chest" /> :*/}
              <img src={close} alt="close" width={20} height={20} />
              {/*}*/}
            </div>
          </Link>
        ))}
      </ul>
    </BottomModal>
  );
};