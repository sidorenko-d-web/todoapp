import { useTranslation } from 'react-i18next';

const getTranslatedSteps = (t: any) => ({
  email: {
    binding: {
      stepIndex: 1,
      stepsTotal: 2,
      title: t("p38"),
      inputLabel: t("p39"),
      placeholder: 'example@mail.com',
      description: t("p40"),
      buttonNext: t("p41"),
      inputRegex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    confirmation: {
      stepIndex: null,
      stepsTotal: null,
      title: t("p38"),
      description: t("p42"),
      buttonResend: t("p43"),
      buttonConfirm: t("p44"),
    },
    success: {
      stepIndex: 2,
      stepsTotal: 2,
      title: t("p38"),
      userPosition: '#2',
      ratingPoints: 12,
      description:t("p45"),
      buttonNext: t("p46"),
    },
  },
  phone: {
    binding: {
      stepIndex: 2,
      stepsTotal: 2,
      title: t("p38"),
      inputLabel: t("p47"),
      placeholder: '+7 (000) 000-00-00',
      description:t("p48"),
      buttonNext: 'Далее',
      inputRegex: /^\+?7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
    },
    confirmation: {
      stepIndex: null,
      stepsTotal: null,
      title: t("p38"),
      description: t("p49"),
      buttonResend: t("p43"),
      buttonConfirm: t("p44"),
    },
    success: {
      stepIndex: -1,
      stepsTotal: 2,
      title: t("p38"),
      userPosition: '#2',
      ratingPoints: 12,
      userShield: '#100',
      description:t("p50"),
      buttonNext: t("p51"),
    },
  },
});

export const useInfluencerRatingSteps = () => {
  const { t } = useTranslation('promotion');
  return getTranslatedSteps(t);
};

export type InfluencerRatingSteps = ReturnType<typeof useInfluencerRatingSteps>;