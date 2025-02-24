import styles from './SkinSetupPage.module.scss';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/shared';
import { WardrobeIcon, WardrobeTabs } from '../../components';

interface SkinSetupPageProps {
  onContinue: () => void;
}

export const SkinSetupPage = ({ onContinue }: SkinSetupPageProps) => {
  const { t } = useTranslation('shop');

  return (
    <div className={styles.root}>
      <div className={styles.wardrobe}>
        <WardrobeIcon />
      </div>
      <div className={styles.buttons}>
        <WardrobeTabs />
      </div>
      <Button className={styles.continueButton} onClick={onContinue}>
        {t('s34')}
      </Button>
      <div className={styles.selectText}>{t('s35')}</div>
    </div>
  );
};
