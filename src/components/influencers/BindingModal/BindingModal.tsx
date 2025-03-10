import { useState } from 'react';
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

export const BindingModal = ({
                               modalId,
                               onClose,
                               binding,
                               onNext,
                             }: BindingModalProps) => {
  const { t } = useTranslation('promotion');
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { inputType } = useSelector((state: RootState) => state.confirmation);

  const [sendCode] = useSendEmailConfirmationCodeMutation();
  const [sendPhone] = useSendPhoneConfirmationCodeMutation();

  // Регулярное выражение для проверки телефонных номеров
  const phoneRegex = /^(\s*)?(\+)?(?!(\d)([- _():=+]?\3){9,})([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;

  const isValid = inputType === 'phone' ? phoneRegex.test(value) : value.trim() !== '';

  const handleNext = async () => {
    try {
      if (inputType === 'email') {
        await sendCode({ email: value.trim() }).unwrap();
        dispatch(setInputValue(value.trim()));
        dispatch(setInputType('phone'));
        setValue('');
        onNext();
      }
      if (inputType === 'phone') {
        if (phoneRegex.test(value)) {
          await sendPhone({ phone_number: value.trim() });
          dispatch(setInputValue(value.trim()));
          setValue('');
          onNext();
        } else {
          setError('Неверный формат номера телефона');
        }
      }
    } catch (err) {
      const error = err as { status: number };
      if (error.status === 409) {
        setError('Такой email уже привязан');
      } else {
        setError('Произошла ошибка при отправке кода подтверждения.');
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
              <span>{binding.stepIndex}/{binding.stepsTotal} {t("p36")}</span>
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
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError('');
                }}
                className={`${s.input} ${!isValid ? s.invalid : ''}`}
                placeholder={binding.placeholder}
              />
              <img className={s.statusIcon} src={!isValid ? dots : tick} />
            </div>
          </div>
          {error && <p className={s.errorMessage}>{error}</p>}
          <span className={ss.semiText}>{binding.description}</span>
        </div>

        <Button disabled={!isValid} onClick={handleNext}>{binding.buttonNext}</Button>
      </div>
    </CentralModal>
  );
};