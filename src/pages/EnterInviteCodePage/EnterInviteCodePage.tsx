import React, { useEffect, useRef, useState } from 'react';
import styles from './EnterInviteCodePage.module.scss';

import lock from '../../assets/icons/lock-gray.svg';
import lockOpen from '../../assets/icons/lock-blue-open.svg';

import dots from '../../assets/icons/dots.svg';
import tick from '../../assets/icons/tick-circle-gray.svg';
import { Button } from '../../components/shared';
import { useSendReferralCodeMutation } from '../../redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

interface EnterInviteCodePageProps {
  referral_id: number;
  onContinue: () => void;
}

interface ReferralErrorResponse {
  status: number;
  message: string;
  type: 'ReferrerNotFound' | 'UserAlreadyIsReferral' | 'UserNotFoundInBotDatabaseException' | 'UnknownError';
}

export const EnterInviteCodePage: React.FC<EnterInviteCodePageProps> = ({ referral_id, onContinue }) => {
  const { t } = useTranslation('referral');
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSentCode, setIsSentCode] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState(false);
  const [sendReferralCode, { isLoading }] = useSendReferralCodeMutation();

  const inputRef = useRef<HTMLInputElement>(null);
  const [initialHeight, setInitialHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight > initialHeight && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
      setInitialHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialHeight]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!touched) setTouched(true);

    if (/^\d*$/.test(value)) {
      setInputValue(value);
      setIsValid(true);
    }
  };

  const handleSubmit = async () => {
    if (!isValid || isLoading) return;

    setErrorMessage('');

    try {
      await sendReferralCode({
        referral_id,
        referral_code: Number.parseInt(inputValue),
      }).unwrap();
      setIsSentCode(true);
      onContinue();
    } catch (error) {
      const err = error as ReferralErrorResponse;
      console.error('Referral code error:', err);

      switch (err.type) {
        case 'ReferrerNotFound':
          setErrorMessage(err.message);
          setIsValid(false);
          break;
        case 'UserAlreadyIsReferral':
          setIsSentCode(true);
          onContinue();
          break;
        case 'UserNotFoundInBotDatabaseException':
          setErrorMessage(err.message);
          setIsValid(false);
          break;
        default:
          setErrorMessage(err.message);
          setIsValid(false);
      }
    }
  };

  return (
    <>
      <div className={styles.root}>
        <img src={isSentCode ? lockOpen : lock} className={styles.lock} width={120} height={120} />

        <div className={styles.inputGroup}>
          <label>{t('r1')}</label>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              className={`${styles.input} ${touched && !isValid ? styles.invalid : ''}`}
              placeholder="..."
            />
            <img className={styles.statusIcon} src={isValid ? tick : dots} alt="status" />
          </div>

          <p className={styles.description}>{t('r2')}</p>
        </div>

        {errorMessage && <p className={styles.descriptionError}>{errorMessage}</p>}

        <Button
          className={classNames(styles.nextBtn, { [styles.validInput]: isValid }, { [styles.btnFocus]: isFocus })}
          onClick={handleSubmit}
        >
          {isLoading ? t('r5') : t('r4')}
        </Button>
        <p className={classNames(styles.enterCodeText, { [styles.textFocus]: isFocus })}>{t('r3')}</p>
      </div>
    </>
  );
};
