import { MODALS } from "../../../constants/modals"
import { useModal } from "../../../hooks/useModal"
import styles from "./LanguageSelectionModal.module.scss"
import { useState } from "react"
import tick from "../../../assets/icons/input-tick.svg"
import circle from "../../../assets/icons/circle-blue.svg"
import { useTranslation } from 'react-i18next';
import { CentralModal } from "../../shared"


const LANGUAGES = [
    {
        code: 'en',
        name: 'English',
    },
    {
        code: 'ru',
        name: 'Русский',
    },
];

type LanguageCode = typeof LANGUAGES[number]['code'];

interface LanguageOptionProps {
    language: typeof LANGUAGES[number];
    isSelected: boolean;
    onSelect: (code: LanguageCode) => void;
}

const LanguageOption = ({ language, isSelected, onSelect }: LanguageOptionProps) => {
    const { t } = useTranslation('settings');
    
    return (
        <div
            className={`${styles.languageWrapper} ${isSelected ? styles.selected : ''}`}
            onClick={() => onSelect(language.code)}
        >
            <div className={styles.languageAndIcon}>
                <span>{language.name}</span>
                <span className={`${styles.status} ${isSelected ? styles.statusEnabled : styles.statusDisabled}`}>
                    {isSelected ? t('s11') : t('s12')}
                </span>
            </div>
            <div className={styles.selectionIconWrapper}>
                <img
                    src={isSelected ? tick : circle}
                    alt={isSelected ? "Selected" : "Not selected"}
                    className={styles.selectionIcon}
                />
            </div>
        </div>
    );
};

export const LanguageSelectionModal = () => {
    const { i18n } = useTranslation();
    const { closeModal } = useModal();
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(i18n.language as LanguageCode);

    const handleCloseModal = () => {
        closeModal(MODALS.LANGUAGE_SELECTION);
    };

    const handleSelectLanguage = async (code: LanguageCode) => {
        setSelectedLanguage(code);
        localStorage.setItem('selectedLanguage', code);
        await i18n.changeLanguage(code);
    };

    return (
        <CentralModal
            modalId={MODALS.LANGUAGE_SELECTION}
            title="Язык/Language"
            headerStyles={styles.titleStyles} 
            onClose={handleCloseModal}
            overlayOpacity={0}
        >
            <div className={styles.wrapper}>
                <div className={styles.languageSection}>
                    {LANGUAGES.map((language) => (
                        <LanguageOption
                            key={language.code}
                            language={language}
                            isSelected={selectedLanguage === language.code}
                            onSelect={handleSelectLanguage}
                        />
                    ))}
                </div>

                <button
                    className={styles.applyButton}
                    onClick={handleCloseModal}
                >
                    Применить/Apply
                </button>
            </div>
        </CentralModal>
    );
};

export default LanguageSelectionModal;