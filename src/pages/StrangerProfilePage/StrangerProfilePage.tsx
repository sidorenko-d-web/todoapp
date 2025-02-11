import { StrangerProfileModal } from '../../components/profile';
import { MODALS } from '../../constants';
import { useModal } from '../../hooks';
import classNames from 'classnames';
import userIcon from '../../assets/icons/user.svg';
import fireIcon from '../../assets/icons/fire.svg';
import infoIcon from '../../assets/icons/info.svg';
import { useParams } from 'react-router-dom';
import { useGetUserProfileInfoByIdQuery } from '../../redux';
import { formatAbbreviation } from '../../helpers';

import s from './StrangerProfilePage.module.scss';
import { Button } from '../../components/shared';

export const StrangerProfilePage = () => {
  const { openModal, closeModal } = useModal();
  const { profileId } = useParams();
  const { data: profile } = useGetUserProfileInfoByIdQuery(profileId || '');

  if (!profile || !profileId) return null;

  // TODO: Раскомментировать когда на бэке будет vip данные
  return (
    <main className={s.page}>
      <div className={s.listUser}>
        <div
          className={classNames(s.cardBlock, {
            /*{ [s.vipCard]: profile.vip }*/
          })}
        >
          <div className={s.card}>
            <img src={userIcon} alt="user" width={27} height={36} />
          </div>
        </div>
        <div className={s.userBlock}>
          <div className={s.userInfo}>
            <h3 className={s.text}>{profile.username}</h3>
            <ul className={classNames(s.ulBlock, s.infoRang)}>
              <li className={s.number}>6</li>
              <li className={s.fireIcon}>
                <img src={fireIcon} alt="fire" width={12} height={12} />
                <span>{formatAbbreviation(profile.points)}</span>
              </li>
              {/*{profile.vip &&*/}
              {/*  <li className={s.vip}>*/}
              {/*    <img src={star} alt="star" width={12} height={12} />*/}
              {/*    <span>VIP</span>*/}
              {/*  </li>}*/}
            </ul>
          </div>
        </div>
        <Button
          className={classNames(s.cardBox, {
            /*{ [s.vipCardBox]: profile.vip }*/
          })}
          onClick={() => openModal(MODALS.STRANGER_PROFILE)}
        >
          {/*{profile.vip ? <img src={chest} height={20} width={20} alt="chest" /> :*/}
          <img src={infoIcon} alt="close" width={20} height={20} />
          {/*}*/}
        </Button>
      </div>

      <StrangerProfileModal
        profileId={profileId}
        modalId={MODALS.STRANGER_PROFILE}
        onClose={() => closeModal(MODALS.STRANGER_PROFILE)}
      />
    </main>
  );
};
