import classNames from 'classnames';

import s from './ReferralCard.module.scss';
import subscribersIcon from '../../../assets/icons/subscribers.png';
import fireBlueIcon from '../../../assets/icons/fire-blue.svg';
import fireGrayIcon from '../../../assets/icons/fire-gray.svg';
import infoIcon from '../../../assets/icons/info.svg';
import infoRedIcon from '../../../assets/icons/info-red.svg';
import goldCoinIcon from '../../../assets/icons/coin.png';
import { useGetUserProfileInfoByIdQuery, useMarkPushReminderSentMutation } from '../../../redux';
import { formatAbbreviation } from '../../../helpers';
import { Button } from '../../shared';
import { useTranslation } from 'react-i18next';

interface ReferralCardProps {
  position: number;
  name: string;
  total_invited: number;
  streak: number;
  days_missed: number;
  id_referral: number;
  reminded_time?: string;
  subscribers_for_referrer: number
  points_for_referrer: number
}

export const ReferralCard: React.FC<ReferralCardProps> = ({
  id_referral,
  position,
  name,
  total_invited,
  streak,
  days_missed,
  reminded_time,
  subscribers_for_referrer,
  points_for_referrer
}) => {
  const { t, i18n } = useTranslation('promotion');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { data } = useGetUserProfileInfoByIdQuery(id_referral.toString());
  const [markPushReminderSent] = useMarkPushReminderSentMutation();
  const handleSendMessage = async () => {
    try {
      await markPushReminderSent(Number(id_referral)).unwrap();
      const message = encodeURIComponent(locale === 'ru' ? t('p58') : t('p58'));
      const telegramLink = `https://t.me/${name}?text=${message}`;

      window.open(telegramLink, '_blank');
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <>
      <div className={s.userCard}>
        <div className={s.userCardTop}>
          <div className={s.infoUser}>
            <div className={s.nameAndStreakWrapper}>
              <span className={s.text}>{name}</span>
              <div className={s.streakWrapper}>
                <span className={s.streakBadge}>
                  {streak} <img src={streak === 0 ? fireGrayIcon : fireBlueIcon} alt={'Streak'} />
                </span>
                {days_missed > 0 && (
                  <span className={classNames(s.streakBadge, days_missed > 1 ? s.notInDays : s.notToday)}>
                    {days_missed > 1 ? (
                      <>
                        <img src={infoIcon} alt="Info" /> {days_missed} {t('p52')}
                      </>
                    ) : (
                      `${t('p53')} :/`
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={classNames(s.userCardRank, s.text)}>{`#${position}`}</div>
        </div>

        <section className={s.userCardStats}>
          <div className={s.userCardBottom}>
            <div className={s.userCardBonus}>
              <span className={s.badge}>
                +
                {subscribers_for_referrer !== undefined
                  ? formatAbbreviation(subscribers_for_referrer, 'number', { locale: locale })
                  : 'N/A'}{' '}
                <img src={subscribersIcon} alt="Подписчики" />
              </span>
              <span className={classNames(s.level, s.text)}>1{t('p4')}.</span>
            </div>
            {subscribers_for_referrer !== undefined &&
              <div className={s.userCardBonus}>
                <span className={s.badge}>
                  +{formatAbbreviation(total_invited * 150, 'number', { locale: locale })}
                  <img src={subscribersIcon} alt="Подписчики" />
                </span>
                <span className={classNames(s.level, s.text)}>2{t('p4')}.</span>
              </div>
            }
            {data?.subscribers_for_second_level_referrals === undefined && <Button className={classNames(s.userCardRefs, s.text)}>
              {`(${t('p54')} ${total_invited} ${t('p55')}.)`}
            </Button>}
          </div>
          <div className={s.userCardBonus}>
            <span className={s.badge}>
              +{formatAbbreviation(points_for_referrer, 'number', { locale: locale })}
              <img src={goldCoinIcon} alt="поинты" />
            </span>
          </div>
        </section>
        {days_missed > 1 && reminded_time === null ? (
          <div className={s.streakWarningWrapper}>
            <span className={classNames(s.streakBadge, s.warning)}>
              <img src={infoRedIcon} alt="Info" /> {t('p56')}
            </span>
            <Button onClick={handleSendMessage} className={s.warningButton}>
              {t('p57')}
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
};
