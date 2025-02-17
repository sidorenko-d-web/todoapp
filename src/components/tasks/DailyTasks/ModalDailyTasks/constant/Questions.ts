import { useTranslation } from 'react-i18next';

interface Question {
  id: number;
  text: string;
  options: Array<{
    id: string;
    label: string;
  }>;
  correctAnswer: string;
}

const getTranslatedQuestions = (t: (key: string) => string): Question[] => [
  {
    id: 1,
    text: t('q18'),
    options: [
      { id: 'APUSH', label: '$APUSH' },
      { id: 'BLUSH', label: '$BLUSH' },
      { id: 'APCHHI', label: '$APCHHI' },
    ],
    correctAnswer: 'APUSH',
  },
  {
    id: 2,
    text: t('q19'),
    options: [
      { id: '10', label: '10 USDT' },
      { id: '50', label: '50 USDT' },
      { id: '100', label: '100 USDT' },
    ],
    correctAnswer: '50',
  },
  {
    id: 3,
    text: t('q20'),
    options: [
      { id: '3', label: t('q21') },
      { id: '5', label: t('q22') },
      { id: '7', label: t('q23') },
    ],
    correctAnswer: '5',
  },
];

export const useQuestions = () => {
  const { t } = useTranslation('quests');
  return getTranslatedQuestions(t);
};