import { InfluencerRatingSteps } from '../../../constants';
import clan from '../../../assets/icons/clan-red.svg';
import { RewardsCards } from '..';
import clsx from 'clsx';
import ss from '../shared.module.scss';
import { Button, CentralModal } from '../../shared';

type BindingSuccessModalProps = {
  modalId: string;
  onClose: () => void;
  success: InfluencerRatingSteps[keyof InfluencerRatingSteps]['success'];
  onNext: () => void;
};

export const BindingSuccessModal = ({
                                      modalId,
                                      onClose,
                                      success,
                                      onNext,
                                    }: BindingSuccessModalProps) => {
  const handleNext = () => {
    onNext();
  };

  return (
    <CentralModal modalId={modalId} title={success.title} onClose={onClose}>
      <div className={ss.content}>
        <div className={ss.innerContent}>
          <RewardsCards stepIndex={success.stepIndex} />

          <span className={ss.semiText}>{success.description}</span>

          <div className={ss.progressBarSection}>
            <div className={ss.progressBarSectionHeader}>
              <span>
                {
                  success.stepIndex === -1 ? 'Готово!' : `${success.stepIndex}/${success.stepsTotal} этапов`
                }
              </span>
              <span className={ss.progressReward}>
              Рейтинг и награды <img src={clan} height={12} width={12} alt="reward" />
            </span>
            </div>
            <div className={clsx(ss.progressBar, success.stepIndex - 1 ? ss.active : '')}>
              <div className={ss.progressBarInner} style={{ width: `${((success.stepIndex - 1) / 2) * 100}%` }} />
            </div>
          </div>
        </div>

        <Button onClick={handleNext}>{success.buttonNext}</Button>
      </div>
    </CentralModal>
  );
};