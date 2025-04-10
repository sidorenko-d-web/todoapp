import classNames from 'classnames';

import s from './ReferralCard.module.scss';
import subscribersIcon from '../../../assets/icons/subscribers.png';
import fireBlueIcon from '../../../assets/icons/fire-blue.svg';
import infoIcon from '../../../assets/icons/info.svg';
import infoRedIcon from '../../../assets/icons/info-red.svg';
import goldCoinIcon from '../../../assets/icons/coin.png';
import { useMarkPushReminderSentMutation } from '../../../redux';
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
  subscribers_for_referrer: number;
  points_for_referrer: number;
  isModal?: boolean;
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
  points_for_referrer,
  isModal,
}) => {
  const { t, i18n } = useTranslation('promotion');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
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

  const isLostStreak = streak === 0;
  const isWarning = days_missed > 1 && reminded_time === null;

  const getDayWord = (number: number, locale: 'ru' | 'en' = 'ru') => {
    if (locale === 'en') {
      if (number === 1) {
        return `${number} day`;
      }
      return `${number} days`;
    } else {
      const lastTwo = number % 100;
      const lastOne = number % 10;

      if (lastTwo >= 11 && lastTwo <= 19) {
        return `${number} дней`;
      }

      switch (lastOne) {
        case 1:
          return `${number} день`;
        case 2:
        case 3:
        case 4:
          return `${number} дня`;
        default:
          return `${number} дней`;
      }
    }
  };

  return (
    <>
      <div className={classNames(s.userCard, isModal && s.inModal)}>
        <div className={s.userCardTop}>
          <div className={s.infoUser}>
            <div className={s.nameAndStreakWrapper}>
              <span className={s.text}>{name}</span>
              <div className={s.streakWrapper}>
                <span
                  className={classNames(s.streakBadge, isLostStreak ? s.textGray : s.textBlue, isWarning && s.textRed)}
                >
                  <img
                    src={isLostStreak ? (isWarning ? infoRedIcon : infoIcon) : fireBlueIcon}
                    className={classNames(isLostStreak && !isWarning && s.isGrayInfo)}
                    alt={'Streak'}
                  />
                  {getDayWord(isWarning ? days_missed : streak, locale)} {isLostStreak && t('p72')} {t('p71')}
                </span>
              </div>
            </div>
          </div>
          <div className={classNames(s.userCardRank, s.text)}>{`#${position}`}</div>
        </div>

        <section className={s.userCardStats}>
          <span className={s.statItem}>
            {subscribers_for_referrer !== undefined
              ? formatAbbreviation(subscribers_for_referrer, 'number', { locale: locale })
              : 'N/A'}{' '}
            <img src={subscribersIcon} alt="Подписчики" />
            <sup>1{t('p73')}</sup>
          </span>

          {total_invited > 0 && (
            <span className={s.statItem}>
              +{formatAbbreviation(total_invited * 150, 'number', { locale: locale })}{' '}
              <img src={subscribersIcon} alt="Подписчики" />
              <sup>2{t('p73')}</sup>
              <span className={s.moreRefs}>({t('p54')} {total_invited} {t('p55')}.)</span>
            </span>
          )}

          {points_for_referrer > 0 && (
            <span className={s.statItem}>
              +{formatAbbreviation(points_for_referrer, 'number', { locale: locale })}{' '}
              <img src={goldCoinIcon} alt="поинты" />
              <sup>{t('p74')}</sup>
            </span>
          )}
        </section>
        {isWarning ? (
          <Button onClick={handleSendMessage} className={s.warningButton}>
            {t('p57')}
          </Button>
        ) : null}
      </div>
    </>
  );
};
