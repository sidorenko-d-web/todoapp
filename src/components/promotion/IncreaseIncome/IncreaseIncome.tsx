import { useState } from 'react';
import peeps from '../../../assets/icons/peeps.svg';
import piggy from '../../../assets/icons/piggy.svg';
import subscribersIcon from '../../../assets/icons/subscribers.svg';
import s from './IncreaseIncome.module.scss';
import classNames from 'classnames';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants';
import { InviteFriend, UserReferrals } from '../Modal';

import { ReferralCard } from '../ReferralCard/ReferralCard';
import { useGetCurrentUsersReferralsQuery } from '../../../redux';

export const IncreaseIncome = () => {
  const [showAll, setShowAll] = useState(false);
  const { openModal, closeModal } = useModal();
  const { data, isLoading, error } = useGetCurrentUsersReferralsQuery();


  const referrals = data?.referrals || [];
  const visibleReferrals = showAll ? referrals : referrals.slice(0, 3);
  const hiddenReferralsCount = referrals.length - 3;

  return (
    <>
      <h2 className={s.headerIncrease}>
        <span className={s.textName}>Увеличьте доход</span>
        <span className={s.badge}>
          +440 <img src={peeps} height={14} width={14} alt="Количество peeps" />
        </span>
      </h2>
      <section className={s.wrapperIncrease}>
        <div className={s.content}>
          <img src={piggy} height={40} width={40} alt="Piggy Icon" />
          <div className={s.contentFriends}>
            <h3 className={s.nameFriends}>Пригласить друзей</h3>
            <ul className={s.subscribers}>
              <li className={s.listBadge}>
                <span className={s.badge}>
                  +120 <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
                </span>
                <span className={classNames(s.level, s.text)}>1ур.</span>
              </li>
              <li className={s.listBadge}>
                <span className={s.badge}>
                  +40 <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
                </span>
                <span className={classNames(s.level, s.text)}>2ур.</span>
              </li>
            </ul>
          </div>
        </div>

        {isLoading && <p>Загрузка данных о рефералах...</p>}

        {error && <p>Не удалось загрузить данные о рефералах</p>}
        {data && <>
          {data.referrals.length > 0 ?
            <div className={s.referralsList}>
              {visibleReferrals.map((referral, index) => (
                <ReferralCard key={index} position={index + 1} name={referral.name} total_invited={referral.total_invited} />
              ))}
              {hiddenReferralsCount > 0 && !showAll && (
                <p
                  className={s.showMore}
                  onClick={() => setShowAll(true)}
                >
                  Ещё {hiddenReferralsCount} рефералов...
                </p>
              )}
            </div> : <p>У вас пока нет рефералов</p>}
        </>}
        <div className={s.buttonsContainer}>
          <button className={classNames(s.buttonContainer, s.text)} onClick={() => openModal(MODALS.INVITE_FRIEND)}>
            Пригласить
          </button>
          <button className={classNames(s.buttonContainerGray, s.text)} onClick={() => openModal(MODALS.USERS_REFERRALS)}>
            Смотреть всех
          </button>
        </div>
        <InviteFriend modalId={MODALS.INVITE_FRIEND} onClose={() => closeModal(MODALS.INVITE_FRIEND)} />
        <UserReferrals modalId={MODALS.USERS_REFERRALS} onClose={() => closeModal(MODALS.USERS_REFERRALS)} />
      </section>
    </>
  );
};
