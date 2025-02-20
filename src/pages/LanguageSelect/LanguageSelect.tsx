import styles from './LanguageSelect.module.scss';
import checkIcon from '../../../src/assets/icons/checkmark-in-the-circle.svg';
import circleIcon from '../../../src/assets/icons/circle-blue.svg';
import usFlag from '../../../src/assets/icons/us-flag.svg';
import ruFlag from '../../../src/assets/icons/ru-flag.svg';
import { Button } from '../../components/shared';

interface LanguageSelectProps {
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
  onContinue: () => void;
}

const LANGUAGES = [
  { id: 'en', flag: usFlag, label: 'English language' },
  { id: 'ru', flag: ruFlag, label: 'Русский язык' },
];

export const LanguageSelect = ({ selectedLanguage, onLanguageSelect, onContinue }: LanguageSelectProps) => {
  return (
    <div className={styles.root}>
      <div className={styles.languageOptions}>
        {LANGUAGES.map(({ id, flag, label }) => (
          <div
            key={id}
            className={`${styles.option} ${selectedLanguage === id ? styles.selected : ''}`}
            onClick={() => onLanguageSelect(id)}
          >
            <div className={styles.flagWrapper}>
              <img src={flag} alt={id.toUpperCase()} className={styles.flag} />
            </div>
            <span className={selectedLanguage === id ? styles.selectedText : ''}>{label}</span>
            <div className={styles.selectWrapper}>
              <img src={selectedLanguage === id ? checkIcon : circleIcon} className={styles.icon} alt="" />
            </div>
          </div>
        ))}
      </div>
      <Button className={styles.continueButton} onClick={onContinue}>
        Продолжить/Continue
      </Button>
      <div className={styles.selectText}>Выберите язык&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Select language</div>
    </div>
  );
};