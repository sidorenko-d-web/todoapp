import React, { useState } from "react";
import { CentralModal, Button } from "../../../../shared";
import { MODALS } from "../../../../../constants";
import { ProgressBar } from "../../../../shared/LoadingScreen/ProgressBar";

import styles from "./EnterEmailModal.module.scss";

import tickIcon from '../../../../../assets/icons/input-tick.svg';
import notEnteredIcon from '../../../../../assets/icons/email-not-entered.svg';
import clanIcon from '../../../../../assets/icons/clan-red.svg';

import avatarPlaceholder from '../../../../../assets/icons/avatar-placeholder.svg'
import chest from '../../../../../assets/icons/chest.svg';
import fire from '../../../../../assets/icons/fire-icon.svg';
import { useModal } from "../../../../../hooks";

interface EnterEmailModalProps {
    onClose: () => void;
}

export const EnterEmailModal: React.FC<EnterEmailModalProps> = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [isValid, setIsValid] = useState(false);

    const { openModal } = useModal();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setIsValid(validateEmail(e.target.value));
    };

    const handleSubmit = () => {
        if (isValid) {
            console.log("Email submitted:", email);
            onClose();
            openModal(MODALS.EMAIL_CONFIRMATION_CODE);
        }
    };

    return (
        <CentralModal title="Рейтинг инфлюенсеров" modalId={MODALS.ENTER_EMAIL} onClose={onClose}>
            <div className={styles.wrp}>
                <div className={styles.imagesWrp}>
                <div className={styles.container}>
                        <div className={styles.tabs}>
                            <div className={`${styles.tab} ${styles.gray}`}>
                                <span><span style={{display: 'inline-block', width: '14px', height: '14px'}}>#</span>???</span>
                            </div>
                            <div className={`${styles.tab} ${styles.gray}`}>
                                <img src={fire} alt="Fire" />
                                <span>???</span>
                            </div>
                        </div>
                        <img src={avatarPlaceholder} className={styles.image} />
                    </div>

                    <div className={styles.container}>
                        <div className={styles.tabs}>
                            <div className={`${styles.tab} ${styles.gray}`}>
                             <span><span style={{display: 'inline-block', width: '14px', height: '14px'}}>#</span>???</span>
                            </div>
                        </div>
                        <img src={chest} className={styles.image} />
                    </div>
                </div>
                <div className={styles.progress}>
                    <div className={styles.progressInfo}>
                        <span>1/2 этапов</span>
                        <div className={styles.ratingTextWrp}>
                            <span>Рейтинг и награды</span>
                            <img src={clanIcon} width={12} height={12} />
                        </div>
                    </div>
                    <ProgressBar progress={0} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Почта</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleChange}
                        className={`${styles.input} ${!isValid ? styles.invalid : ""}`}
                        placeholder="example@mail.com"
                    />
                    <img className={styles.statusIcon} src={isValid ? tickIcon : notEnteredIcon} />
                </div>
                {/* {!isValid && email.length > 0 && <p className={styles.errorText}>Введите корректный email</p>} */}
                <p className={styles.description}>
                    Вы сможете видеть список лучших игроков и просматривать их профили, а также сами станете участником рейтинга!
                    Привяжите вашу почту, чтобы открыть доступ.
                </p>
                <Button className={styles.submitBtn} onClick={handleSubmit} disabled={!isValid || !email.trim()}>
                    Далее
                </Button>
            </div>
        </CentralModal>
    );
};
