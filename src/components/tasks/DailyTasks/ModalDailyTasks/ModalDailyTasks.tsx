import { FC, useEffect, useState } from 'react';
import giftIcon from '../../../../assets/icons/gift.svg';
import coinIcon from '../../../../assets/icons/coin.png';
import classNames from 'classnames';
import s from './ModalDailyTasks.module.scss';
import BottomModal from '../../../shared/BottomModal/BottomModal';

import circleIcon from '../../../../assets/icons/circle-blue.svg';
import circleWhiteIcon from '../../../../assets/icons/circle.svg';
import checkIcon from '../../../../assets/icons/checkmark-in-the-circle.svg';
import bookIcon from '../../../../assets/icons/book.svg';
import CrossRedIcon from '../../../../assets/icons/cross-red-in-circle.svg';
import { formatAbbreviation } from '../../../../helpers';
import { Button } from '../../../shared';
import { TaskBoost, DailyQuestion } from '../../../../redux/api/tasks/dto';
import { useGetTaskQuestionsQuery } from '../../../../redux/api/tasks/api';

type ModalDailyTasksProps = {
  modalId: string;
  onClose: () => void;
  onStateChange: (states: QuestionState[]) => void;
  taskId: string;
  totalSteps: number;
  boost: TaskBoost;
};

type QuestionState = 'solved' | 'current' | 'closed';

export const ModalDailyTasks: FC<ModalDailyTasksProps> = ({
                                                            modalId,
                                                            onClose,
                                                            onStateChange,
                                                            taskId,
                                                            totalSteps,
                                                            boost,
                                                          }) => {
  const { data: questions } = useGetTaskQuestionsQuery(taskId);
  const isQuestionsArray = Array.isArray(questions);
  const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState(0);
  const [ selectedOption, setSelectedOption ] = useState<string | null>(null);
  const [ showResult, setShowResult ] = useState(false);
  const [ answeredQuestions, setAnsweredQuestions ] = useState<boolean[]>([]);

  useEffect(() => {
    if (isQuestionsArray && questions) {
      setAnsweredQuestions(Array(questions.length).fill(false));
    }
  }, [questions, isQuestionsArray]);

  const getQuestionStates = (): QuestionState[] => {
    if (!isQuestionsArray || !questions) return [];
    return questions.map((_, index) => {
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
  }, [ currentQuestionIndex, answeredQuestions ]);

  if (!isQuestionsArray || !questions || questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const correctAnswer = currentQuestion.answer_options.find(option => option.is_correct);
  const isCorrectAnswer = selectedOption === correctAnswer?.id;

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    setShowResult(false);
  };

  const handleNext = () => {
    if (isCorrectAnswer) {
      const newAnsweredQuestions = [ ...answeredQuestions ];
      newAnsweredQuestions[currentQuestionIndex] = true;
      setAnsweredQuestions(newAnsweredQuestions);

      if (currentQuestionIndex === questions.length - 1) {
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
    if (answeredQuestions[index] && correctAnswer?.id) {
      setCurrentQuestionIndex(index);
      setSelectedOption(correctAnswer.id);
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
            {formatAbbreviation(10)} - {formatAbbreviation(1000)}
            <img src={coinIcon} alt="coin" width={14} height={14} />
          </span>
          <span className={s.reward}>
            ???
            <img src={giftIcon} alt="gift" width={14} height={14} />
          </span>
        </div>

        {/* Progress indicator using question states */}
        <div className={s.progress}>
          <span className={s.step}>{currentQuestionIndex + 1}/{questions.length}</span>
          <div className={s.dots}>
            {questions.map((_, index) => {
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
          <h3 className={s.questionText}>{currentQuestion.question_text}</h3>

          <div className={s.options}>
            {currentQuestion.answer_options.map(option => {
              const isSelected = selectedOption === option.id;
              const isWrong = showResult && isSelected && !option.is_correct;

              return (
                <div
                  key={option.id}
                  className={classNames(s.option, {
                    [s.selected]: isSelected && !isWrong,
                    [s.wrong]: isWrong,
                  })}
                  onClick={() => handleSelectOption(option.id)}
                >
                  <span className={classNames({
                    [s.selectedText]: isSelected && !isWrong,
                    [s.wrongText]: isWrong,
                  })}>
                    {option.answer_text}
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
          <Button className={s.answerButton}>
            Ответы
            <img src={bookIcon} alt="" className={s.buttonIcon} />
          </Button>
          <Button
            className={classNames(s.nextButton, {
              [s.active]: selectedOption !== null,
            })}
            disabled={!selectedOption}
            onClick={handleNext}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Завершить' : 'Далее'}
          </Button>
        </div>
      </div>
    </BottomModal>
  );
};