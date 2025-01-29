import { useState } from 'react';
import peeps from '../../../assets/icons/peeps.svg';
import piggy from '../../../assets/icons/piggy.svg';
import subscribersIcon from '../../../assets/icons/subscribers.svg';
import s from './IncreaseIncome.module.scss';
import classNames from 'classnames';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants';
import { InviteFriend } from '../Modal';

export const IncreaseIncome = () => {
  const [open, setOpen] = useState(false);
  const { openModal, closeModal } = useModal();

  const openRef = () => {
    setOpen(!open);
  };

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
        <div className={s.userCard}>
          <div className={s.userCardTop}>
            <div className={s.infoUser}>
              <div className={s.userCardAvatar}>😊</div>
              <div className={classNames(s.userCardUsername, s.text)}>Никнейм пользователя</div>
            </div>
            <div className={classNames(s.userCardRank, s.text)}>#1</div>
          </div>
          <div className={s.userCardBottom}>
            <div className={s.userCardBonus}>
              <span className={s.badge}>
              +120 <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
              </span>
              <span className={classNames(s.level, s.text)}>1ур.</span>
            </div>
            <div className={s.userCardBonus}>
              <span className={s.badge}>
              +40 <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
              </span>
              <span className={classNames(s.level, s.text)}>2ур.</span>
            </div>
            <button className={classNames(s.userCardRefs, s.text)} onClick={openRef}>
              (ещё 2 реф.)
            </button>
          </div>
        </div>
        {open && (
          <>
            <div className={s.userCard}>
              <div className={s.userCardTop}>
                <div className={s.infoUser}>
                  <div className={s.userCardAvatar}>😊</div>
                  <div className={classNames(s.userCardUsername, s.text)}>Никнейм пользователя</div>
                </div>
                <div className={classNames(s.userCardRank, s.text)}>#2</div>
              </div>
              <div className={s.userCardBottom}>
                <div className={s.userCardBonus}>
              <span className={s.badge}>
              +120 <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
              </span>
                  <span className={classNames(s.level, s.text)}>1ур.</span>
                </div>
                <div className={s.userCardBonus}>
              <span className={s.badge}>
              +40 <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
              </span>
                  <span className={classNames(s.level, s.text)}>2ур.</span>
                </div>
              </div>
            </div>
            <div className={s.userCard}>
              <div className={s.userCardTop}>
                <div className={s.infoUser}>
                  <div className={s.userCardAvatar}>😊</div>
                  <div className={classNames(s.userCardUsername, s.text)}>Никнейм пользователя</div>
                </div>
                <div className={classNames(s.userCardRank, s.text)}>#3</div>
              </div>
              <div className={s.userCardBottom}>
                <div className={s.userCardBonus}>
              <span className={s.badge}>
              +120 <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
              </span>
                  <span className={classNames(s.level, s.text)}>1ур.</span>
                </div>
                <div className={s.userCardBonus}>
              <span className={s.badge}>
              +40 <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
              </span>
                  <span className={classNames(s.level, s.text)}>2ур.</span>
                </div>
              </div>
            </div>
          </>
        )}

        <button className={classNames(s.buttonContainer, s.text)} onClick={() => openModal(MODALS.INVITE_FRIEND)}>
          Пригласить
        </button>
        <InviteFriend modalId={MODALS.INVITE_FRIEND} onClose={() => closeModal(MODALS.INVITE_FRIEND)}/>
      </section>
    </>
  );
};
