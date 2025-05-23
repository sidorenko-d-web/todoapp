import classNames from 'classnames';
import { formatAbbreviation } from '../../../helpers';
import { Button } from '../../shared';
import s from './StrangerHeader.module.scss';
import { useGetPushLineQuery, useGetUserProfileInfoByIdQuery } from '../../../redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import userIcon from '../../../assets/icons/user.svg';
import fireIcon from '../../../assets/icons/fire.svg';
import infoIcon from '../../../assets/icons/info.svg';

export const StrangerHeader = () => {
  const { data } = useGetPushLineQuery();
  const { profileId } = useParams();
  const { data: profile } = useGetUserProfileInfoByIdQuery(profileId || '');

  const streaks = data?.week_information.filter(
    day => day && (day.push_line_data?.status === 'unspecified' || day.push_line_data?.status === 'passed'),
  ).length;

  const navigate = useNavigate();

  const isRoom = useLocation().pathname.includes('room');

  const handleNavigate = () => navigate(isRoom ? '/profile/' + profileId : '/profile/' + profileId + '/room');

  return (
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
          <h3 className={s.text}>{profile?.username}</h3>
          <ul className={classNames(s.ulBlock, s.infoRang)}>
            <li className={s.number}>{profile?.growth_tree_stage_id}</li>
            <li className={s.fireIcon}>
              <img src={fireIcon} alt="fire" width={12} height={12} />
              <span>{formatAbbreviation(streaks ?? 0)}</span>
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
        onClick={handleNavigate}
      >
        {/*{profile.vip ? <img src={chest} height={20} width={20} alt="chest" /> :*/}
        <img src={infoIcon} alt="close" width={20} height={20} />
        {/*}*/}
      </Button>
    </div>
  );
};
