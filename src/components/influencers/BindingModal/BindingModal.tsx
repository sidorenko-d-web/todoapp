import { useState, useEffect, useRef } from 'react';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { InfluencerRatingSteps } from '../../../constants';
import tick from '../../../assets/icons/input-tick.svg';
import clan from '../../../assets/icons/clan-red.svg';
import dots from '../../../assets/icons/dots.svg';
import { RewardsCards } from '..';
import clsx from 'clsx';
import s from './BindingModal.module.scss';
import ss from '../shared.module.scss';
import { Button, CentralModal } from '../../shared';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  RootState,
  setInputType,
  useSendEmailConfirmationCodeMutation,
  useSendPhoneConfirmationCodeMutation,
} from '../../../redux';
import { setInputValue } from '../../../redux/slices/confirmation';

type BindingModalProps = {
  modalId: string;
  onClose: () => void;
  binding: InfluencerRatingSteps[keyof InfluencerRatingSteps]['binding'];
  onNext: () => void;
};

export const BindingModal = ({ modalId, onClose, binding, onNext }: BindingModalProps) => {
  const { t } = useTranslation('promotion');
  const [value, setValue] = useState<string>('');
  const [formattedValue, setFormattedValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const { inputType } = useSelector((state: RootState) => state.confirmation);

  const [sendCode] = useSendEmailConfirmationCodeMutation();
  const [sendPhone] = useSendPhoneConfirmationCodeMutation();

  useEffect(() => {
    if (inputType === 'phone') {
      formatPhoneNumber();
    } else {
      setFormattedValue(value);
    }
  }, [value, inputType]);

  const formatPhoneNumber = () => {
    const formatter = new AsYouType();
    const formatted = formatter.input(value);

    // Для российских номеров делаем специальное форматирование
    if (formatted.startsWith('+7') && value.replace(/\D/g, '').length > 1) {
      const digits = value.replace(/\D/g, '').substring(1);
      let result = '+7 (';

      if (digits.length > 0) {
        result += digits.substring(0, 3);
      }
      if (digits.length > 3) {
        result += ') ' + digits.substring(3, 6);
      }
      if (digits.length > 6) {
        result += '-' + digits.substring(6, 8);
      }
      if (digits.length > 8) {
        result += '-' + digits.substring(8, 10);
      }

      setFormattedValue(result);
      return;
    }

    setFormattedValue(formatted);
  };

  const isValidPhone = (phone: string) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(phone);
      return phoneNumber?.isValid() || false;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const isValid = inputType === 'phone' ? isValidPhone(value) : inputType === 'email' ? isValidEmail(value) : false;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    let cleaned = input.replace(/[^\d+]/g, '');

    if ((cleaned.match(/\+/g) || []).length > 1) {
      cleaned = '+' + cleaned.replace(/\+/g, '');
    }

    if (cleaned.startsWith('8') && cleaned.length > 1) {
      cleaned = '+7' + cleaned.substring(1);
    }

    setValue(cleaned);
    setError('');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError('');
  };

  const handleNext = async () => {
    try {
      if (inputType === 'email') {
        await sendCode({ email: value.trim() }).unwrap();
        dispatch(setInputValue(value.trim()));
        dispatch(setInputType('phone'));
        setValue('');
        setFormattedValue('');
        onNext();
      } else if (inputType === 'phone') {
        if (isValidPhone(value)) {
          await sendPhone({ phone_number: value.trim() }).unwrap();
          dispatch(setInputValue(value.trim()));
          setValue('');
          setFormattedValue('');
          onNext();
        } else {
          setError(t('p67'));
        }
      }
    } catch (err) {
      const error = err as { status: number; data?: { message?: string } };
      if (error.status === 409) {
        setError(t('p69'));
      } else {
        setError(error.data?.message || t('p68'));
      }
    }
  };

  return (
    <CentralModal modalId={modalId} title={binding.title} onClose={onClose}>
      <div className={ss.content}>
        <div className={ss.innerContent}>
          <RewardsCards stepIndex={binding.stepIndex} />

          <div className={ss.progressBarSection}>
            <div className={ss.progressBarSectionHeader}>
              <span>
                {binding.stepIndex}/{binding.stepsTotal} {t('p36')}
              </span>
              <span className={ss.progressReward}>
                {t('p37')} <img src={clan} height={12} width={12} alt="reward" />
              </span>
            </div>
            <div className={clsx(ss.progressBar, binding.stepIndex - 1 ? ss.active : '')}>
              <div className={ss.progressBarInner} style={{ width: `${((binding.stepIndex - 1) / 2) * 100}%` }} />
            </div>
          </div>

          <div className={s.inputGroup}>
            <label>{binding.inputLabel}</label>
            <div className={s.inputWrapper}>
              <input
                ref={inputRef}
                type={inputType === 'email' ? 'text' : 'tel'}
                value={inputType === 'phone' ? formattedValue : value}
                onChange={inputType === 'phone' ? handlePhoneChange : handleEmailChange}
                className={`${s.input} ${!isValid ? s.invalid : ''}`}
                placeholder={inputType === 'phone' ? binding.placeholder : binding.placeholder}
              />
              <img className={s.statusIcon} src={!isValid ? dots : tick} />
            </div>
          </div>
          {error && <p className={s.errorMessage}>{error}</p>}
          <span className={ss.semiText}>{binding.description}</span>
        </div>

        <Button disabled={!isValid} onClick={handleNext}>
          {binding.buttonNext}
        </Button>
      </div>
    </CentralModal>
  );
};
