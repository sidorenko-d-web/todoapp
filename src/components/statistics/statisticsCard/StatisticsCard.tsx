import { FC } from 'react';
import styles from './StatisticsCard.module.scss';
import CoinIcon from '../../../assets/icons/coin.png';
import view from '../../../assets/icons/views.png';
import logo from '../../../assets/icons/dot.png';
import integrations from '../../../assets/icons/integrations.svg';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';

interface Props {
  id: string;
  views: number;
  number: number;
  points: string;
  companyName: string;
  onClick: () => void;
}

const StatisticsCard: FC<Props> = ({ views, points, companyName, onClick, number }) => {
  const { t, i18n } = useTranslation('statistics');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

  return (
    <>
      <div className={styles.statisticsCard} onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className={styles.left}>
          <img src={integrations} alt="" width={40} height={40} />
        </div>
        <div className={styles.right}>
          <div className={styles.header}>
            <p className={styles.title}>
              {t('s5')} {number}
            </p>
            <div className={styles.logo}>
              <p>{companyName}</p>
              <img src={logo} alt="" width={14} height={14} />
            </div>
          </div>
          <div className={styles.scores}>
            <div className={styles.item}>
              <p>{formatAbbreviation(views, 'number', { locale: locale })}</p>
              <img src={view} alt="" width={14} height={14} />
            </div>
            <div className={styles.item}>
              <p>{formatAbbreviation(points, 'number', { locale: locale })}</p>
              <img src={CoinIcon} alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatisticsCard;
