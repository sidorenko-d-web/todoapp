import classNames from 'classnames';

import s from './ReferralCard.module.scss';
import subscribersIcon from '../../../assets/icons/subscribers.png';
import fireBlueIcon from '../../../assets/icons/fire-blue.svg';
import fireGrayIcon from '../../../assets/icons/fire-gray.svg';
import infoIcon from '../../../assets/icons/info.svg';
import infoRedIcon from '../../../assets/icons/info-red.svg';

import profileIconPlaceholder from '../../../assets/icons/referral-icon-placeholder.svg';
import { formatAbbreviation } from '../../../helpers';
import { Button } from '../../shared';
import { useTranslation } from 'react-i18next';
import { useMarkPushReminderSentMutation } from '../../../redux';

interface ReferralCardProps {
  position: number;
  name: string;
  total_invited: number;
  streak: number;
  days_missed: number;
  id_referral: number;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({id_referral, position, name, total_invited, streak, days_missed }) => {
  const { t, i18n } = useTranslation('promotion');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const [markPushReminderSent] = useMarkPushReminderSentMutation();

  const handleSendMessage = async () => {
    try {
      await markPushReminderSent(id_referral).unwrap();
      const message = encodeURIComponent(t("p58"));
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
            <div className={s.userCardAvatar}>
              <img src={profileIconPlaceholder} width={24} height={24} />
            </div>
            <div className={s.nameAndStreakWrapper}>
              <span className={s.text}>{name}</span>
              <div className={s.streakWrapper}>
                <span className={s.streakBadge}>{streak} <img src={streak === 0 ? fireGrayIcon : fireBlueIcon}
                                                              alt={'Streak'} /></span>
                {days_missed > 0 &&
                  <span className={classNames(s.streakBadge, days_missed > 1 ? s.notInDays : s.notToday)}>{days_missed > 1 ? (
                    <>
                      <img src={infoIcon} alt="Info" /> {days_missed} {t('p52')}
                    </>
                  ) : `${t('p53')} :/`}</span>}
              </div>
            </div>
          </div>
          <div className={classNames(s.userCardRank, s.text)}>{`#${position}`}</div>
        </div>
        <div className={s.userCardBottom}>
          <div className={s.userCardBonus}>
                        <span className={s.badge}>
                            +{formatAbbreviation(120, 'number', { locale: locale })} <img src={subscribersIcon}
                                                                                          alt="Подписчики" />
                        </span>
            <span className={classNames(s.level, s.text)}>1{t('p4')}.</span>
          </div>
          <div className={s.userCardBonus}>
                        <span className={s.badge}>
                            +{formatAbbreviation(40, 'number', { locale: locale })} <img src={subscribersIcon}
                                                                                         alt="Подписчики" />
                        </span>
            <span className={classNames(s.level, s.text)}>2{t('p4')}.</span>
          </div>
          <Button className={classNames(s.userCardRefs, s.text)}>
            {`(${t('p54')} ${total_invited} ${t('p55')}.)`}
          </Button>
        </div>
        {days_missed > 1 && (
          <div className={s.streakWarningWrapper}>
            <span className={classNames(s.streakBadge, s.warning)}>
              <img
                src={infoRedIcon}
                alt="Info"
              /> {t('p56')}
            </span>
            <Button onClick={handleSendMessage} className={s.warningButton}>{t('p57')}</Button>
          </div>
        )}
      </div>
    </>
  );
};