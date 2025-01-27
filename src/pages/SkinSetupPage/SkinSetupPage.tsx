import { useState } from 'react';
import styles from './SkinSetupPage.module.scss';
import humanIcon from '../../../src/assets/icons/human.svg';
import sckinIcon from '../../../src/assets/icons/skin.svg';

interface SkinSetupPageProps {
  onContinue: () => void;
}

const BODY_PARTS = [
  { id: 'head', label: 'Голова' },
  { id: 'face', label: 'Лицо' },
  { id: 'top', label: 'Верх' },
  { id: 'bottom', label: 'Низ' },
];

const SKIN_OPTIONS = Array(9)
  .fill(null)
  .map((_, index) => ({
    id: `skin${index + 1}`,
    value: index + 1,
  }));

export const SkinSetupPage = ({ onContinue }: SkinSetupPageProps) => {
  const [selectedPart, setSelectedPart] = useState('head');
  const [selectedSkin, setSelectedSkin] = useState('skin1');

  return (
    <div className={styles.root}>
      <div className={styles.avatarSection}>
        <div className={styles.avatarPreview}>
          <img src={humanIcon} alt="Human" />
        </div>
        <div className={styles.bodyPartsContainer}>
          {BODY_PARTS.map(part => (
            <button
              key={part.id}
              onClick={() => setSelectedPart(part.id)}
              className={`${styles.bodyPartButton} ${selectedPart === part.id ? styles.active : ''}`}
            >
              {part.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.skinOptionsGrid}>
        {SKIN_OPTIONS.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => setSelectedSkin(option.id)}
            aria-selected={selectedSkin === option.id}
            className={styles.skinOption}
            data-selected={selectedSkin === option.id}
          >
            <img src={sckinIcon} alt={`Skin option ${option.value}`} />
          </button>
        ))}
      </div>
      <button className={styles.continueButton} onClick={onContinue}>
        Продолжить
      </button>
      <div className={styles.selectText}>Настройте внешность</div>
    </div>
  );
};