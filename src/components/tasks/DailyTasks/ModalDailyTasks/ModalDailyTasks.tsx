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
import { Task } from '../../../../redux/api/tasks';
import { useUpdateTaskMutation } from '../../../../redux/api/tasks';
import { useTranslation } from 'react-i18next';

interface ModalDailyTasksProps {
  modalId: string;
  onClose: () => void;
  onStateChange: (states: QuestionState[]) => void;
  taskId: string;
  task: Task;
}

type QuestionState = 'solved' | 'current' | 'closed';

export const ModalDailyTasks: FC<ModalDailyTasksProps> = ({
  modalId,
  onClose,
  onStateChange,
  taskId,
  task,
}) => {
  const { t, i18n } = useTranslation('quests');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const [updateTask] = useUpdateTaskMutation();
  const questions = task.questions || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(task.completed_stages);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shake, setShake] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [channelLink] = useState(locale === 'en' ? task.external_link_eng || task.external_link : task.external_link);
  const isVibrationSupported = 'vibrate' in navigator;

  useEffect(() => {
    setAnsweredQuestions(
      Array(questions.length)
        .fill(false)
        .map((_, index) => index < task.completed_stages),
    );
  }, [questions.length, task.completed_stages]);

  const getQuestionStates = (): QuestionState[] => {
    return questions.map((_, index) => {
      if (index < task.completed_stages) {
        return 'solved';
      } else if (index === currentQuestionIndex) {
        return 'current';
      }
      return 'closed';
    });
  };

  useEffect(() => {
    onStateChange?.(getQuestionStates());
  }, [currentQuestionIndex, answeredQuestions, task.completed_stages]);

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return null;
  }

  const correctAnswer = currentQuestion.answer_options.find(option => option.is_correct);
  const isCorrectAnswer = selectedOption === correctAnswer?.id;

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    setShowResult(false);
  };

  const handleNext = async () => {
    if (isCorrectAnswer) {
      setCorrect(true);
      setTimeout(() => setSelectedOption(null), 1000);

      const newAnsweredQuestions = [...answeredQuestions];
      newAnsweredQuestions[currentQuestionIndex] = true;
      setAnsweredQuestions(newAnsweredQuestions);

      try {
        const newCompletedStages = currentQuestionIndex + 1;
        await updateTask({
          id: taskId,
          data: {
            completed_stages: newCompletedStages,
            link: task.external_link,
            question_id: currentQuestion.id,
            answer_option_id: selectedOption as string,
          },
        });

        onStateChange?.(getQuestionStates());

        if (newCompletedStages === questions.length) {
          setShowResult(true);
          setTimeout(() => onClose(), 1000);
          return;
        }

        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setCorrect(false);
        setShowResult(false);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    } else {
      setShowResult(true);
      setShake(true);

      if (isVibrationSupported) {
        navigator.vibrate(200);
      }

      setTimeout(() => {
        setShake(false);
        setShowResult(false);
      }, 500);
    }
  };

  const handleDotClick = (index: number) => {
    if (index <= task.completed_stages) {
      setCurrentQuestionIndex(index);
      setSelectedOption(correctAnswer?.id || null);
      setShowResult(true);
    }
  };

  const handleOpenGuide = () => {
    window.open(channelLink, '_blank');
  };

  return (
    <BottomModal
      modalId={modalId}
      title={t('q2')}
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
          <h3 className={s.questionText}>
            {locale === 'en' 
              ? currentQuestion.question_text_eng 
              : currentQuestion.question_text}
          </h3>

          <div className={s.options}>
            {currentQuestion.answer_options.map(option => {
              const isSelected = selectedOption === option.id;
              const isWrong = showResult && isSelected && !option.is_correct;
              const isCorrect = isSelected && correct;

              return (
                <div
                  key={option.id}
                  className={classNames(s.option, {
                    [s.selected]: isSelected && (!isWrong || !isCorrect),
                    [s.wrong]: isWrong,
                    [s.shake]: shake && isWrong,
                    [s.correct]: isCorrect,
                  })}
                  onClick={() => handleSelectOption(option.id)}
                >
                  <span className={classNames({
                    [s.selectedText]: isSelected && !isWrong,
                    [s.wrongText]: isWrong,
                  })}>
                    {locale === 'en' ? option.answer_text_eng : option.answer_text}
                  </span>
                  <div className={s.selectWrapper}>
                    <img
                      src={
                        isSelected || isCorrect
                          ? (showResult && isWrong ? CrossRedIcon : checkIcon)
                          : circleIcon
                      }
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
          <Button
            className={s.answerButton}
            onClick={handleOpenGuide}
          >
            {t('q27')}
            <img src={bookIcon} alt="" className={s.buttonIcon} />
          </Button>
          <Button
            className={classNames(s.nextButton, {
              [s.active]: selectedOption !== null && !shake,
            })}
            disabled={!selectedOption || shake}
            onClick={handleNext}
          >
            {currentQuestionIndex === questions.length - 1 ? t('q25') : t('q26')}
          </Button>
        </div>
      </div>
    </BottomModal>
  );
};