import { useState } from 'react';
import styles from './LanguageSelect.module.scss';
import checkIcon from '../../../src/assets/icons/checkmark-in-the-circle.svg';
import circleIcon from '../../../src/assets/icons/circle-blue.svg';

const LANGUAGES = [
  { id: 'en', flag: '/us-flag.svg', label: 'English language' },
  { id: 'ru', flag: '/ru-flag.svg', label: 'Русский язык' },
];

export const LanguageSelect = () => {
  const [selectedLang, setSelectedLang] = useState('en');

  return (
    <div className={styles.root}>
      <div className={styles.languageOptions}>
        {LANGUAGES.map(({ id, flag, label }) => (
          <div
            key={id}
            className={`${styles.option} ${selectedLang === id ? styles.selected : ''}`}
            onClick={() => setSelectedLang(id)}
          >
            <div className={styles.flagWrapper}>
              <img src={flag} alt={id.toUpperCase()} className={styles.flag} />
            </div>
            <span className={selectedLang === id ? styles.selectedText : ''}>{label}</span>
            <div className={styles.selectWrapper}>
              <img src={selectedLang === id ? checkIcon : circleIcon} className={styles.icon} alt="" />
            </div>
          </div>
        ))}
      </div>
      <button className={styles.continueButton}>Продолжить/Continue</button>
      <div className={styles.selectText}>Выберите язык&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Select language</div>
    </div>
  );
};
