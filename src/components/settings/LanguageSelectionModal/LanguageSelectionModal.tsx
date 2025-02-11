import { MODALS } from "../../../constants/modals"
import { useModal } from "../../../hooks/useModal"
import styles from "./LanguageSelectionModal.module.scss"
import { useState } from "react"


import tick from "../../../assets/icons/input-tick.svg"
import circle from "../../../assets/icons/circle-blue.svg"
import russiaIcon from "../../../assets/icons/ru-flag.svg"
import usaIcon from "../../../assets/icons/us-flag.svg"
import { useTranslation } from 'react-i18next';
import { CentralModal } from "../../shared"


const LANGUAGES = [
    {
        code: 'en',
        name: 'English language',
        icon: usaIcon,
    },
    {
        code: 'ru',
        name: 'Русский язык',
        icon: russiaIcon,
    },
];

type LanguageCode = typeof LANGUAGES[number]['code'];

interface LanguageOptionProps {
    language: typeof LANGUAGES[number];
    isSelected: boolean;
    onSelect: (code: LanguageCode) => void;
}

const LanguageOption = ({ language, isSelected, onSelect }: LanguageOptionProps) => (
    <div
        className={`${styles.languageWrapper} ${isSelected ? styles.selected : ''}`}
        onClick={() => onSelect(language.code)}
    >
        <div className={`${styles.languageAndIcon} ${isSelected ? styles.selectedText : ''}`}>
            <div className={styles.countryIconWrapper}>
                <img className={styles.countryIcon} src={language.icon} alt={`${language.name} icon`} />
            </div>
            {language.name}
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

export const LanguageSelectionModal = () => {
    const { i18n } = useTranslation();
    const { closeModal } = useModal();
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | null>(null);

    const handleCloseModal = () => {
        // TODO: implement language change logic

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
            title="Язык / Language"
            headerStyles={styles.titleStyles} 
            onClose={handleCloseModal}
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
                    Apply / Применить
                </button>
            </div>
        </CentralModal>
    );
};

export default LanguageSelectionModal;