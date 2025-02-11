export const INFLUENCER_RATING_STEPS = {
  email: {
    binding: {
      stepIndex: 1,
      stepsTotal: 2,
      title: 'Рейтинг инфлюенсеров',
      inputLabel: 'Почта',
      placeholder: 'example@mail.com',
      description:
        'Вы сможете видеть список лучших игроков и просматривать их профили, а также сами станете участником рейтинга! Привяжите вашу почту, чтобы открыть доступ.',
      buttonNext: 'Далее',
      inputRegex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    confirmation: {
      stepIndex: null,
      stepsTotal: null,
      title: 'Рейтинг инфлюенсеров',
      description: 'Введите код подтверждения, полученный на ваш почтовый адрес: ',
      buttonResend: 'Отправить повторно',
      buttonConfirm: 'Подтвердить',
    },
    success: {
      stepIndex: 2,
      stepsTotal: 2,
      title: 'Рейтинг инфлюенсеров',
      userPosition: '#2',
      ratingPoints: 12,
      description:
        'Поздравляем! Теперь вам доступен рейтинг инфлюенсеров! Ваша позиция в рейтинге: #2',
      buttonNext: 'Продолжить',
    },
  },
  phone: {
    binding: {
      stepIndex: 2,
      stepsTotal: 2,
      title: 'Рейтинг инфлюенсеров',
      inputLabel: 'Номер телефона WhatsApp',
      placeholder: '+7 (000) 000-00-00',
      description:
        'Вы сможете получать еженедельный сундучок за продвижение по шкале рейтинга!',
      buttonNext: 'Далее',
      inputRegex: /^\+?7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
    },
    confirmation: {
      stepIndex: null,
      stepsTotal: null,
      title: 'Рейтинг инфлюенсеров',
      description: 'Введите код подтверждения, полученный в приложении WhatsApp',
      buttonResend: 'Отправить повторно',
      buttonConfirm: 'Подтвердить',
    },
    success: {
      stepIndex: -1,
      stepsTotal: 2,
      title: 'Рейтинг инфлюенсеров',
      userPosition: '#2',
      ratingPoints: 12,
      userShield: '#100',
      description:
        'Поздравляем! Теперь вы участвуете в еженедельном розыгрыше Драгоценных сундучков!',
      buttonNext: 'Отлично!',
    },
  },
};

export type InfluencerRatingSteps = typeof INFLUENCER_RATING_STEPS;
