import React, { useState } from "react";
import styles from './EnterInviteCodePage.module.scss';

import lock from '../../assets/icons/lock-gray.svg';
import lockOpen from '../../assets/icons/lock-blue-open.svg';

import dots from '../../assets/icons/dots.svg';
import tick from '../../assets/icons/tick-circle-gray.svg';
import { Button } from "../../components/shared";

export const EnterInviteCodePage: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [isValid, setIsValid] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Allow only digits and limit to 6 characters
        if (/^\d*$/.test(value) && value.length <= 6) {
            setInputValue(value);
            setIsValid(value.length === 6);
        }
    };

    return (
        <div className={styles.root}>
            <img src={isValid ? lockOpen : lock} className={styles.lock} width={120} height={120} />

            <div className={styles.inputGroup}>
                <label>Код приглашения</label>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className={`${styles.input} ${!isValid && inputValue.length === 6 ? styles.invalid : ''}`}
                        placeholder="..."
                        maxLength={6}
                    />
                    <img
                        className={styles.statusIcon}
                        src={isValid ? tick : dots}
                        alt="status"
                    />
                </div>

                <p className={styles.description}>
                    Это закрытый проект. Введите код приглашения или перейдите по ссылке-приглашению от участника
                </p>
            </div>

            <Button className={`${styles.nextBtn} ${isValid ? styles.validInput : ''}`}>
                Продолжить
            </Button>
            <p className={styles.enterCodeText}>Введите код приглашения</p>
        </div>
    );
};