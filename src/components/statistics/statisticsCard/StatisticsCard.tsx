import { FC } from 'react';
import styles from './StatisticsCard.module.scss';
import CoinIcon from '../../../assets/icons/coin.png';
import view from '../../../assets/icons/views.png';
import logo from '../../../assets/icons/dot.png';
import integrations from '../../../assets/icons/integrations.svg';
import { formatAbbreviation } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import { useIncrementingIntegrationStats } from '../../../hooks/useIncrementingIntegrationStats.ts';
import { usePushLineStatus } from '../../../hooks/usePushLineStatus.ts';
import { CompanyImg } from '../../../redux/index.ts';
import { getCompanyLogo } from '../../../utils/getCompanyLogo.ts';

interface Props {
  id: string;
  views: number;
  number: number;
  points: string;
  campaign: CompanyImg;
  futureStatistics: {
    income: string;
    views: number;
    subscribers: number;
  };
  lastUpdatedAt?: string;
  companyName: string;
  onClick: () => void;
}

const StatisticsCard: FC<Props> = ({
  id,
  views: initialViews,
  points,
  companyName,
  campaign,
  onClick,
  number,
  futureStatistics,
  lastUpdatedAt,
}) => {
  const { t, i18n } = useTranslation('statistics');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { views: displayedViews, income: displayedIncome } = useIncrementingIntegrationStats({
    integrationId: id,
    baseSubscribers: 0,
    baseViews: initialViews,
    baseIncome: points,
    futureStatistics,
    lastUpdatedAt,
  });

  const { in_streak } = usePushLineStatus();

  const views = in_streak ? displayedViews : initialViews;
  const income = in_streak ? displayedIncome : points;

  return (
    <>
      <div className={styles.statisticsCard} onClick={onClick} style={{ cursor: 'pointer' }}>
        <div className={styles.left}>
          <img
            src={campaign.image_url || getCompanyLogo(campaign.company_name) || integrations}
            alt="logo"
            className={styles.imgCompany}
          />
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
              <img src={view} alt="" width={18} height={18} />
            </div>
            <div className={styles.item}>
              <p>{formatAbbreviation(income, 'number', { locale: locale })}</p>
              <img src={CoinIcon} alt="" width={18} height={18} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatisticsCard;
