import { useState } from 'react';
import styles from './LanguageSelect.module.scss';

export const LanguageSelect = () => {
  const [selectedLang, setSelectedLang] = useState('en');

  return (
    <div className={styles.root}>
      <div className={styles.languageOptions}>
        <div
          className={`${styles.option} ${selectedLang === 'en' ? styles.selected : ''}`}
          onClick={() => setSelectedLang('en')}
        >
          <img src="/us-flag.svg" alt="US" />
          <span>English language</span>
          <div className={styles.check} />
        </div>

        <div
          className={`${styles.option} ${selectedLang === 'ru' ? styles.selected : ''}`}
          onClick={() => setSelectedLang('ru')}
        >
          <img src="/ru-flag.svg" alt="RU" />
          <span>Русский язык</span>
          <div className={styles.check} />
        </div>
      </div>

      <button className={styles.continueButton}>Продолжить/Continue</button>
      <div className={styles.selectText}>Выберите язык | Select language</div>
    </div>
  );
};
