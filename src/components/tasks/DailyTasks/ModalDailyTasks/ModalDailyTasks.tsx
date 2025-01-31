import { FC, useState } from 'react';
import giftIcon from '../../../../assets/icons/gift.svg';
import coinIcon from '../../../../assets/icons/coin.svg';
import classNames from 'classnames';
import s from './ModalDailyTasks.module.scss';
import BottomModal from '../../../shared/BottomModal/BottomModal';

import circleIcon from '../../../../assets/icons/circle-blue.svg';
import circleWhiteIcon from '../../../../assets/icons/circle.svg';
import checkIcon from '../../../../assets/icons/checkmark-in-the-circle.svg';
import bookIcon from '../../../../assets/icons/book.svg';
import CrossRedIcon from '../../../../assets/icons/cross-red-in-circle.svg';

interface ModalDailyTasksProps {
  modalId: string;
  onClose: () => void;
}

export const ModalDailyTasks: FC<ModalDailyTasksProps> = ({ modalId, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);

  const CORRECT_ANSWER = 'APUSH';

  const options = [
    { id: 'APUSH', label: '$APUSH' },
    { id: 'BLUSH', label: '$BLUSH' },
    { id: 'APCHHI', label: '$APCHHI' },
  ];

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    setIsWrongAnswer(optionId !== CORRECT_ANSWER);
  };

  return (
    <BottomModal
      modalId={modalId}
      title="Ежедневный подарок"
      onClose={onClose}
    >
      <div className={s.container}>
        {/* Награды */}
        <div className={s.rewards}>
          <span className={s.reward}>
            10 - 1000
            <img src={coinIcon} alt="coin" width={14} height={14} />
          </span>
          <span className={s.reward}>
            ???
            <img src={giftIcon} alt="gift" width={14} height={14} />
          </span>
        </div>

        {/* Индикатор прогресса */}
        <div className={s.progress}>
          <span className={s.step}>2/3</span>
          <div className={s.dots}>
            <img src={checkIcon} alt="completed" width={18} height={18} />
            <img src={circleWhiteIcon} alt="current" width={18} height={18} />
            <img src={circleIcon} alt="next" width={18} height={18} />
          </div>
        </div>

        {/* Вопрос */}
        <div className={s.question}>
          <h3 className={s.questionText}>
            В какой валюте вы будете зарабатывать на нашей иновационной платформе Apusher?
          </h3>

          <div className={s.options}>
            {options.map(option => (
              <div
                key={option.id}
                className={classNames(s.option, {
                  [s.selected]: selectedOption === option.id,
                  [s.wrong]: selectedOption === option.id && isWrongAnswer
                })}
                onClick={() => handleSelectOption(option.id)}
              >
          <span className={selectedOption === option.id ? s.selectedText : ''}>
            {option.label}
          </span>
                <div className={s.selectWrapper}>
                  <img
                    src={selectedOption === option.id
                      ? (isWrongAnswer && selectedOption === option.id ? CrossRedIcon : checkIcon)
                      : circleIcon}
                    className={s.icon}
                    alt=""
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопки */}
        <div className={s.buttons}>
          <button className={s.answerButton}>
            Ответы
            <img src={bookIcon} alt="" className={s.buttonIcon} />
          </button>
          <button
            className={classNames(s.nextButton, {
              [s.active]: selectedOption !== null
            })}
            disabled={!selectedOption}
          >
            Далее
          </button>
        </div>
      </div>
    </BottomModal>
  );
};

export default ModalDailyTasks;