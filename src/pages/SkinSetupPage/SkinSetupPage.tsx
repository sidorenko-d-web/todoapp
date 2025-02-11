import { useState } from 'react';
import styles from './SkinSetupPage.module.scss';
import humanIcon from '../../../src/assets/icons/human.svg';
import sckinIcon from '../../../src/assets/icons/skin.svg';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/shared';

interface SkinSetupPageProps {
  onContinue: () => void;
}

const SKIN_OPTIONS = Array(9)
  .fill(null)
  .map((_, index) => ({
    id: `skin${index + 1}`,
    value: index + 1,
  }));

export const SkinSetupPage = ({ onContinue }: SkinSetupPageProps) => {
  const { t } = useTranslation('shop');
  const [selectedPart, setSelectedPart] = useState('head');
  const [selectedSkin, setSelectedSkin] = useState('skin1');

  const BODY_PARTS = [
    { id: 'head', label: t('s30') },
    { id: 'face', label: t('s31') },
    { id: 'top', label: t('s7') },
    { id: 'bottom', label: t('s8') },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.avatarSection}>
        <div className={styles.avatarPreview}>
          <img src={humanIcon} alt="Human" />
        </div>
        <div className={styles.bodyPartsContainer}>
          {BODY_PARTS.map(part => (
            <Button
              key={part.id}
              onClick={() => setSelectedPart(part.id)}
              className={`${styles.bodyPartButton} ${selectedPart === part.id ? styles.active : ''}`}
            >
              {part.label}
            </Button>
          ))}
        </div>
      </div>
      <div className={styles.skinOptionsGrid}>
        {SKIN_OPTIONS.map(option => (
          <Button
            key={option.id}
            type="button"
            onClick={() => setSelectedSkin(option.id)}
            aria-selected={selectedSkin === option.id}
            className={styles.skinOption}
            data-selected={selectedSkin === option.id}
          >
            <img src={sckinIcon} alt={`Skin option ${option.value}`} />
          </Button>
        ))}
      </div>
      <Button className={styles.continueButton} onClick={onContinue}>
        {t('s34')}
      </Button>
      <div className={styles.selectText}>{t('s35')}</div>
    </div>
  );
};