import { useEffect, useState } from 'react';
import { InfluencerRatingSteps } from '../../../constants';
import OtpInput from 'react-otp-input';

import s from './BindingConfirmationModal.module.scss';
import ss from '../shared.module.scss';
import { Button, CentralModal } from '../../shared';

import { useSelector } from 'react-redux';
import { RootState, useConfirmEmailMutation } from '../../../redux';

type BindingConfirmationModalProps = {
  modalId: string;
  onClose: () => void;
  confirmation: InfluencerRatingSteps[keyof InfluencerRatingSteps]['confirmation'];
  onNext: () => void;
};

export const BindingConfirmationModal = ({
  modalId,
  onClose,
  confirmation,
  onNext,
}: BindingConfirmationModalProps) => {
  const [value, setValue] = useState<string>('');
  const [timer, setTimer] = useState<number>(20);
  const [error, setError] = useState('');
  const isValid = value && value.length === 6;


  const { inputValue } = useSelector((state: RootState) => state.confirmation);


  const [confirmEmail] = useConfirmEmailMutation();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResend = () => {
    setTimer(20);
  };

  const handleNext = async () => {
    if (!isValid) return;

    try {
        await confirmEmail({ email: inputValue, confirmation_code: value }).unwrap();
      // dispatch(setInputType('phone'));
      setValue('');
      onNext();
    } catch (err) {
      const error = err as { status: number };
      if (error.status === 400) {
        setError('Введён неверный код подтверждения');
      } else {
        setError('Произошла ошибка при отправке кода подтверждения.');
      }
    }
  };

  return (
    <CentralModal modalId={modalId} title={confirmation.title} onClose={onClose}>
      <div className={ss.content}>
        <div className={ss.innerContent}>
          <span className={ss.semiText}>{confirmation.description}</span>

          <OtpInput
            value={value}
            onChange={(val) => {
              setError('');
              setValue(val); // Allow any input (no regex check)
            }}
            numInputs={6}
            containerStyle={s.inputContainer}
            inputStyle={s.input}
            renderInput={(props) => (
              <input
                {...props}
                onKeyDown={(e) => {
                  // Allow all keys except for specific control keys
                  if (
                    e.key !== 'Backspace' &&
                    e.key !== 'ArrowLeft' &&
                    e.key !== 'ArrowRight' &&
                    e.key !== 'Delete' &&
                    e.key !== 'Tab'
                  ) {
                    // Allow any input (no regex check)
                  }

                  if (props.onKeyDown) {
                    props.onKeyDown(e);
                  }
                }}
              />
            )}
          />

          {error && <p className={s.errorMessage}>{error}</p>}

          <Button
            className={ss.textButton}
            disabled={timer > 0}
            onClick={handleResend}
          >
            {confirmation.buttonResend} {timer > 0 && `[${timer}]`}
          </Button>
        </div>

        <Button disabled={!isValid} onClick={handleNext}>{confirmation.buttonConfirm}</Button>
      </div>
    </CentralModal>
  );
};
