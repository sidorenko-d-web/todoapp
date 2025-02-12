import { useState } from 'react';
import peeps from '../../../assets/icons/peeps.svg';
import piggy from '../../../assets/icons/piggy.svg';
import subscribersIcon from '../../../assets/icons/subscribers.png';
import s from './IncreaseIncome.module.scss';
import classNames from 'classnames';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants';
import { InviteFriend, UserReferrals } from '../Modal';

import { ReferralCard } from '../ReferralCard/ReferralCard';
import { useGetCurrentUsersReferralsQuery } from '../../../redux';
import { formatAbbreviation } from '../../../helpers';
import { TrackedButton } from '../..';

export const IncreaseIncome = () => {
  const [ showAll, setShowAll ] = useState(false);
  const { openModal, closeModal } = useModal();

  const { data, isLoading, error } = useGetCurrentUsersReferralsQuery();


  const referrals = data?.referrals || [];
  const visibleReferrals = showAll ? referrals : referrals.slice(0, 3);
  const hiddenReferralsCount = referrals.length - 3;

  return (
    <>
      <h2 className={s.headerIncrease}>
        <span className={s.textName}>Увеличьте доход</span>
        {data && data.referrals.length > 0 && <span className={s.badge}>
          +440 <img src={peeps} height={14} width={14} alt="Количество peeps" />
        </span>}
      </h2>
      <section className={s.wrapperIncrease}>
        <div className={s.content}>
          <img src={piggy} height={40} width={40} alt="Piggy Icon" />
          <div className={s.contentFriends}>
            <h3 className={s.nameFriends}>Пригласить друзей</h3>
            <ul className={s.subscribers}>
              <li className={s.listBadge}>
                <span className={s.badge}>
                  +{formatAbbreviation(120)} <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
                </span>
                <span className={classNames(s.level, s.text)}>1ур.</span>
              </li>
              <li className={s.listBadge}>
                <span className={s.badge}>
                  +{formatAbbreviation(40)} <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
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
                <ReferralCard key={index} position={index + 1} name={referral.name}
                              total_invited={referral.total_invited} />
              ))}
              {hiddenReferralsCount > 0 && !showAll && (
                <p
                  className={s.showMore}
                  onClick={() => setShowAll(true)}
                >
                  Ещё {hiddenReferralsCount} рефералов...
                </p>
              )}
            </div> :
            <p className={s.noReferrals}>Пригласите друга в MiniApp и получайте постояные бонусы к подписчикам!</p>}
        </>}
        <div className={s.buttonsContainer}>
          <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: 'Пригласить - Продвижение - Увеличьте доход',
            }}
            className={classNames(s.buttonContainer, s.text)}
            onClick={() => openModal(MODALS.INVITE_FRIEND)}
          >
            Пригласить
          </TrackedButton>
          <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: 'Смотреть всех - Продвижение - Увеличьте доход',
            }}
            className={classNames(s.buttonContainerGray, s.text)}
            onClick={() => openModal(MODALS.USERS_REFERRALS)}
          >
            Смотреть всех
          </TrackedButton>
        </div>
        <InviteFriend modalId={MODALS.INVITE_FRIEND} onClose={() => closeModal(MODALS.INVITE_FRIEND)} />
        <UserReferrals modalId={MODALS.USERS_REFERRALS} onClose={() => closeModal(MODALS.USERS_REFERRALS)} />
      </section>
    </>
  );
};
