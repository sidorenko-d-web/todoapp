import { FC, useEffect, useState } from 'react';
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
  onStateChange?: (states: QuestionState[]) => void;
}

type QuestionState = 'solved' | 'current' | 'closed';
interface Question {
  id: number;
  text: string;
  options: Array<{
    id: string;
    label: string;
  }>;
  correctAnswer: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'В какой валюте вы будете зарабатывать на нашей иновационной платформе Apusher?',
    options: [
      { id: 'APUSH', label: '$APUSH' },
      { id: 'BLUSH', label: '$BLUSH' },
      { id: 'APCHHI', label: '$APCHHI' },
    ],
    correctAnswer: 'APUSH',
  },
  {
    id: 2,
    text: 'Какой минимальный депозит для старта?',
    options: [
      { id: '10', label: '10 USDT' },
      { id: '50', label: '50 USDT' },
      { id: '100', label: '100 USDT' },
    ],
    correctAnswer: '50',
  },
  {
    id: 3,
    text: 'Сколько уровней в реферальной программе?',
    options: [
      { id: '3', label: '3 уровня' },
      { id: '5', label: '5 уровней' },
      { id: '7', label: '7 уровней' },
    ],
    correctAnswer: '5',
  },
];

export const ModalDailyTasks: FC<ModalDailyTasksProps> = ({
                                                            modalId,
                                                            onClose,
                                                            onStateChange
                                                          }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    Array(QUESTIONS.length).fill(false)
  );

  const getQuestionStates = (): QuestionState[] => {
    return QUESTIONS.map((_, index) => {
      if (answeredQuestions[index]) {
        return 'solved';
      } else if (index === currentQuestionIndex) {
        return 'current';
      }
      return 'closed';
    });
  };

  useEffect(() => {
    onStateChange?.(getQuestionStates());
  }, [currentQuestionIndex, answeredQuestions]);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isCorrectAnswer = selectedOption === currentQuestion.correctAnswer;

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    setShowResult(false);
  };

  const handleNext = () => {
    if (isCorrectAnswer) {
      const newAnsweredQuestions = [...answeredQuestions];
      newAnsweredQuestions[currentQuestionIndex] = true;
      setAnsweredQuestions(newAnsweredQuestions);

      if (currentQuestionIndex === QUESTIONS.length - 1) {
        setShowResult(true);
        setTimeout(() => onClose(), 1000);
        return;
      }

      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleDotClick = (index: number) => {
    if (answeredQuestions[index]) {
      setCurrentQuestionIndex(index);
      setSelectedOption(QUESTIONS[index].correctAnswer);
      setShowResult(true);
    }
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

        {/* Progress indicator using question states */}
        <div className={s.progress}>
          <span className={s.step}>{currentQuestionIndex + 1}/{QUESTIONS.length}</span>
          <div className={s.dots}>
            {QUESTIONS.map((_, index) => {
              const state = getQuestionStates()[index];
              const iconSrc = state === 'solved'
                ? checkIcon
                : state === 'current'
                  ? circleWhiteIcon
                  : circleIcon;

              return (
                <img
                  key={index}
                  src={iconSrc}
                  alt="step"
                  width={18}
                  height={18}
                  onClick={() => handleDotClick(index)}
                  style={{ cursor: state === 'solved' ? 'pointer' : 'default' }}
                />
              );
            })}
          </div>
        </div>


        {/* Вопрос */}
        <div className={s.question}>
          <h3 className={s.questionText}>{currentQuestion.text}</h3>

          <div className={s.options}>
            {currentQuestion.options.map(option => {
              const isSelected = selectedOption === option.id;
              const isWrong = showResult && isSelected && !isCorrectAnswer;

              return (
                <div
                  key={option.id}
                  className={classNames(s.option, {
                    [s.selected]: isSelected,
                    [s.wrong]: isWrong,
                  })}
                  onClick={() => handleSelectOption(option.id)}
                >
                  <span className={classNames({
                    [s.selectedText]: isSelected && !isWrong,
                    [s.wrongText]: isWrong,
                  })}>
                    {option.label}
                  </span>
                  <div className={s.selectWrapper}>
                    <img
                      src={isSelected
                        ? (showResult && isWrong ? CrossRedIcon : checkIcon)
                        : circleIcon}
                      className={s.icon}
                      alt=""
                    />
                  </div>
                </div>
              );
            })}
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
              [s.active]: selectedOption !== null,
            })}
            disabled={!selectedOption}
            onClick={handleNext}
          >
            {currentQuestionIndex === QUESTIONS.length - 1 ? 'Завершить' : 'Далее'}
          </button>
        </div>
      </div>
    </BottomModal>
  );
};