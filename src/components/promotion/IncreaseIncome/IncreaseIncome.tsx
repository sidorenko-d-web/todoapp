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
import { useTranslation } from 'react-i18next';

export const IncreaseIncome = () => {
  const { t, i18n } = useTranslation('promotion');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { openModal, closeModal } = useModal();
  const { data, isLoading, error } = useGetCurrentUsersReferralsQuery();
  // const data = {
  //   referrals: [
  //     {
  //         username: "player_one",
  //         total_invited: 5,
  //         character_data: {
  //             head_skin_id: "4441d0c8-2eb8-42bf-b1ed-e91915658ca7", // Дреды
  //             face_skin_id: "f867c256-55f0-4a73-b284-ccc104bb436d", // Мужское лицо
  //             upper_body_skin_id: "bf728b0c-ee61-47c0-bd3c-f7874de9fb8a", // Худи
  //             legs_skin_id: "16af56a0-b19a-49bc-8c1d-63772a4c4755", // Джинсы
  //             feet_skin_id: "57dbdf97-7f55-4555-b12c-e858750b0442", // Кроссовки
  //             skin_color: "tan",
  //             gender: "male",
  //             vip_skin_id: "046c8fe0-b45d-4d9b-bc63-d60f84b83ea8", // Трамп-Империя
  //             id: "1",
  //             profile_id: "id1"
  //         },
  //         push_line_data: {
  //             status: "active",
  //             in_streak_days: 0,
  //             next_reward: "reward_1",
  //             days_for_next_reward: 2,
  //             failed_at: "",
  //             failed_days_ago: 1,
  //             week_information: [
  //                 {
  //                     date: "2025-02-19T08:47:35.146Z",
  //                     status: "completed",
  //                     is_notified_at_morning: true,
  //                     is_notified_at_afternoon: false,
  //                     is_notified_at_evening: false,
  //                     is_notified_at_late_evening: false,
  //                     is_notified_at_night: false,
  //                     is_notified_at_late_night: false
  //                 }
  //             ]
  //         }
  //     },
  //     {
  //       username: "player_one",
  //       total_invited: 5,
  //       character_data: {
  //           head_skin_id: "4441d0c8-2eb8-42bf-b1ed-e91915658ca7", // Дреды
  //           face_skin_id: "f867c256-55f0-4a73-b284-ccc104bb436d", // Мужское лицо
  //           upper_body_skin_id: "bf728b0c-ee61-47c0-bd3c-f7874de9fb8a", // Худи
  //           legs_skin_id: "16af56a0-b19a-49bc-8c1d-63772a4c4755", // Джинсы
  //           feet_skin_id: "57dbdf97-7f55-4555-b12c-e858750b0442", // Кроссовки
  //           skin_color: "tan",
  //           gender: "male",
  //           vip_skin_id: "046c8fe0-b45d-4d9b-bc63-d60f84b83ea8", // Трамп-Империя
  //           id: "1",
  //           profile_id: "id1"
  //       },
  //       push_line_data: {
  //           status: "active",
  //           in_streak_days: 0,
  //           next_reward: "reward_1",
  //           days_for_next_reward: 2,
  //           failed_at: "",
  //           failed_days_ago: 1,
  //           week_information: [
  //               {
  //                   date: "2025-02-19T08:47:35.146Z",
  //                   status: "completed",
  //                   is_notified_at_morning: true,
  //                   is_notified_at_afternoon: false,
  //                   is_notified_at_evening: false,
  //                   is_notified_at_late_evening: false,
  //                   is_notified_at_night: false,
  //                   is_notified_at_late_night: false
  //               }
  //           ]
  //       }
  //   },
  //     {
  //       username: "player_one",
  //       total_invited: 5,
  //       character_data: {
  //           head_skin_id: "4441d0c8-2eb8-42bf-b1ed-e91915658ca7", // Дреды
  //           face_skin_id: "f867c256-55f0-4a73-b284-ccc104bb436d", // Мужское лицо
  //           upper_body_skin_id: "bf728b0c-ee61-47c0-bd3c-f7874de9fb8a", // Худи
  //           legs_skin_id: "16af56a0-b19a-49bc-8c1d-63772a4c4755", // Джинсы
  //           feet_skin_id: "57dbdf97-7f55-4555-b12c-e858750b0442", // Кроссовки
  //           skin_color: "tan",
  //           gender: "male",
  //           vip_skin_id: "046c8fe0-b45d-4d9b-bc63-d60f84b83ea8", // Трамп-Империя
  //           id: "1",
  //           profile_id: "id1"
  //       },
  //       push_line_data: {
  //           status: "active",
  //           in_streak_days: 0,
  //           next_reward: "reward_1",
  //           days_for_next_reward: 2,
  //           failed_at: "",
  //           failed_days_ago: 1,
  //           week_information: [
  //               {
  //                   date: "2025-02-19T08:47:35.146Z",
  //                   status: "completed",
  //                   is_notified_at_morning: true,
  //                   is_notified_at_afternoon: false,
  //                   is_notified_at_evening: false,
  //                   is_notified_at_late_evening: false,
  //                   is_notified_at_night: false,
  //                   is_notified_at_late_night: false
  //               }
  //           ]
  //       }
  //   },
  //     {
  //         username: "player_two",
  //         total_invited: 2,
  //         character_data: {
  //             head_skin_id: "2ef2a79b-6d1d-4ba1-a00c-4a440ef5dcb3", // Короткие волосы
  //             face_skin_id: "5931b470-1d74-405c-acec-9decf2590f57", // Женское лицо
  //             upper_body_skin_id: "ea2acf41-d4bd-4418-aa5c-6de690404fac", // Блуза
  //             legs_skin_id: "4810858f-0c34-4370-b32d-0f5dc8bc1198", // Юбка-карандаш
  //             feet_skin_id: "7acbc4fe-5693-4a42-b3b2-b93d2f4ac980", // Балетки
  //             skin_color: "fair",
  //             gender: "female",
  //             vip_skin_id: "046c8fe0-b45d-4d9b-bc63-d60f84b83ea8", // Трамп-Империя
  //             id: "2",
  //             profile_id: "id1"
  //         },
  //         push_line_data: {
  //             status: "inactive",
  //             in_streak_days: 0,
  //             next_reward: "reward_2",
  //             days_for_next_reward: 5,
  //             failed_at: "2025-02-18T08:47:35.146Z",
  //             failed_days_ago: 2,
  //             week_information: [
  //                 {
  //                     date: "2025-02-17T08:47:35.146Z",
  //                     status: "missed",
  //                     is_notified_at_morning: false,
  //                     is_notified_at_afternoon: false,
  //                     is_notified_at_evening: false,
  //                     is_notified_at_late_evening: false,
  //                     is_notified_at_night: false,
  //                     is_notified_at_late_night: false
  //                 }
  //             ]
  //         }
  //     },
  //     {
  //         username: "player_three",
  //         total_invited: 8,
  //         character_data: {
  //             head_skin_id: "36a861ae-a33d-4a67-8800-0c7374d0fbdf", // Шапка-бини
  //             face_skin_id: "d60a609c-8206-4d6c-9c04-2e5c5d0f76d3", // Очки-авиаторы
  //             upper_body_skin_id: "fe4bbf1b-99d9-458e-b2df-249900a2831c", // Кожаная куртка
  //             legs_skin_id: "0ff1dac8-7315-401b-b024-679898212560", // Шорты
  //             feet_skin_id: "909066f7-5149-4466-b12d-aa7ea7f332e9", // Тяжелые ботинки
  //             skin_color: "dark",
  //             gender: "male",
  //             vip_skin_id: "046c8fe0-b45d-4d9b-bc63-d60f84b83ea8", // Трамп-Империя
  //             id: "3",
  //             profile_id: "id3"
  //         },
  //         push_line_data: {
  //             status: "active",
  //             in_streak_days: 10,
  //             next_reward: "reward_3",
  //             days_for_next_reward: 1,
  //             failed_at: "",
  //             failed_days_ago: 0,
  //             week_information: [
  //                 {
  //                     date: "2025-02-19T08:47:35.146Z",
  //                     status: "completed",
  //                     is_notified_at_morning: true,
  //                     is_notified_at_afternoon: true,
  //                     is_notified_at_evening: true,
  //                     is_notified_at_late_evening: false,
  //                     is_notified_at_night: false,
  //                     is_notified_at_late_night: false
  //                 }
  //             ]
  //         }
  //     }
  // ]
  // };

  const referrals = data?.referrals || [];
  const visibleReferrals = referrals.slice(0, 3);
  const hiddenReferralsCount = referrals.length - 3;

  return (
    <>
      <h2 className={s.headerIncrease}>
        <span className={s.textName}>{t('p2')}</span>
        <span className={s.badge}>
          +{formatAbbreviation(0, 'number', { locale: locale })} <img src={peeps}
                                                                      alt="Количество peeps" />
        </span>
      </h2>
      <section className={s.wrapperIncrease}>
        <div className={s.content}>
          <img className={s.piggy} src={piggy} alt="Piggy Icon" />
          <div className={s.contentFriends}>
            <h3 className={s.nameFriends}>{t('p3')}</h3>
            <ul className={s.subscribers}>
              <li className={s.listBadge}>
                <span className={s.badge}>
                  +{formatAbbreviation(120, 'number', { locale: locale })} <img src={subscribersIcon}
                                                                                alt="Подписчики" />
                </span>
                <span className={classNames(s.level, s.text)}>1{t('p4')}.</span>
              </li>
              <li className={s.listBadge}>
                <span className={s.badge}>
                  +{formatAbbreviation(40, 'number', { locale: locale })} <img src={subscribersIcon} alt="Подписчики" />
                </span>
                <span className={classNames(s.level, s.text)}>2{t('p4')}.</span>
              </li>
            </ul>
          </div>
        </div>

        {isLoading && <p>{t('p18')}</p>}

        {error && <p>{t('p19')}</p>}

        {data && <>
          {data.referrals.length > 0 ?
            <div className={s.referralsList}>
              {visibleReferrals.map((referral, index) => (
                <ReferralCard key={index} position={index + 1} name={referral.username}
                              id_referral={Number(referral.character_data.id)}
                              total_invited={referral.total_invited} streak= {referral.push_line_data.in_streak_days}
                              days_missed={referral.push_line_data.failed_days_ago}/>
              ))}
              {hiddenReferralsCount > 0 && (
                <p
                  className={s.showMore}
                >
                  {t('p16')} {hiddenReferralsCount} {t('p17')}
                </p>
              )}
            </div> :
            <p className={s.noReferrals}>{t('p5')}</p>}
        </>}
        <div className={s.buttonsContainer}>
          <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: `${t('p6')} - ${t('p1')} - ${t('p15')}`,
            }}
            className={classNames(s.buttonContainer, s.text)}
            onClick={() => openModal(MODALS.INVITE_FRIEND)}
          >
            {t('p6')}
          </TrackedButton>
          {data && data.referrals.length > 3 && <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: `${t('p7')} - ${t('p1')} - ${t('p15')}`,
            }}
            className={classNames(s.buttonContainerGray, s.text)}
            onClick={() => openModal(MODALS.USERS_REFERRALS)}
          >
            {t('p7')}
          </TrackedButton>}
        </div>
        <InviteFriend modalId={MODALS.INVITE_FRIEND} onClose={() => closeModal(MODALS.INVITE_FRIEND)} />
        <UserReferrals modalId={MODALS.USERS_REFERRALS} onClose={() => closeModal(MODALS.USERS_REFERRALS)} />
      </section>
    </>
  );
};
