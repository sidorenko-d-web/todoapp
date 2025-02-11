import { useEffect, useState } from 'react';
import { InfluencerRatingSteps } from '../../../constants';
import OtpInput from 'react-otp-input';

import s from './BindingConfirmationModal.module.scss';
import ss from '../shared.module.scss';
import { Button, CentralModal } from '../../shared';

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
  const [ value, setValue ] = useState<string>('');
  const [ timer, setTimer ] = useState<number>(20);
  const isValid = value && value.length === 6;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [ timer ]);

  const handleResend = () => {
    setTimer(20);
  };

  const handleNext = () => {
    setValue('');
    onNext();
  };

  return (
    <CentralModal modalId={modalId} title={confirmation.title} onClose={onClose}>
      <div className={ss.content}>
        <div className={ss.innerContent}>
          <span className={ss.semiText}>{confirmation.description}</span>

          <OtpInput
            value={value}
            onChange={(val) => {
              if (/^\d*$/.test(val)) {
                setValue(val);
              }
            }}
            numInputs={6}
            containerStyle={s.inputContainer}
            inputStyle={s.input}
            renderInput={(props) => (
              <input
                {...props}
                onKeyDown={(e) => {
                  if (!/^\d$/.test(e.key) &&
                    e.key !== 'Backspace' &&
                    e.key !== 'ArrowLeft' &&
                    e.key !== 'ArrowRight' &&
                    e.key !== 'Delete' &&
                    e.key !== 'Tab') {
                    e.preventDefault();
                  }

                  if (props.onKeyDown) {
                    props.onKeyDown(e);
                  }
                }}
              />
            )}
          />

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
