import { useCallback, useEffect, useState } from 'react';
import { useSignInMutation } from '../../redux';
import { useTranslation } from 'react-i18next';
import { performSignIn } from './authService';
import { AuthStep } from './typesAuth.ts';
import { buildMode } from '../../constants';
// import { buildMode } from '../../constants/config.ts';
// import { useModal } from '../useModal.ts';
// import { MODALS } from '../../constants';

export const useAuthFlow = () => {
  const { i18n } = useTranslation();
  const [ signIn ] = useSignInMutation();
  const [ currentStep, setCurrentStep ] = useState<AuthStep>('loading');
  const [ selectedLanguage, setSelectedLanguage ] = useState(() => localStorage.getItem('selectedLanguage') || 'en');
  const [ isInitializing, setIsInitializing ] = useState(true);
  const [ isAnimationFinished, setIsAnimationFinished ] = useState(false);
  // const { closeModal, openModal } = useModal();

  const saveCurrentStep = useCallback((step: AuthStep) => {
    if (step !== 'loading') {
      localStorage.setItem('currentSetupStep', step);
    }
    setCurrentStep(step);
  }, []);

  const updateTokens = useCallback((authResponse: { access_token: string }) => {
    if (authResponse?.access_token) {
      localStorage.setItem('access_token', authResponse.access_token);
    }
  }, []);

  // Выбор языка
  const handleLanguageSelect = useCallback(
    async (language: string) => {
      setSelectedLanguage(language);
      localStorage.setItem('selectedLanguage', language);
      await i18n.changeLanguage(language);
    },
    [ i18n ],
  );

  const handleLanguageContinue = useCallback(async () => {
    try {
      if (!localStorage.getItem('access_token')) {
        const authResponse = await performSignIn(signIn);
        updateTokens(authResponse);
      }
      saveCurrentStep('skin');
    } catch (err: any) {
      console.error('Ошибка при обновлении токена:', err);
      if (err?.status === 401 || err?.status === 403) {
        saveCurrentStep('invite_code');
      }
    }
  }, [ signIn, updateTokens, saveCurrentStep ]);

  const handleInviteCodeContinue = useCallback(async () => {
    try {
      if (!localStorage.getItem('access_token')) {
        const authResponse = await performSignIn(signIn);
        updateTokens(authResponse);
      }
      saveCurrentStep('skin');
    } catch (err: any) {
      console.error('Ошибка при авторизации:', err);
    }
  }, [ signIn, updateTokens, saveCurrentStep ]);

  const handleSkinContinue = () => {
    localStorage.setItem('setupCompleted', '1');
    saveCurrentStep('final_loading');
    setTimeout(() => saveCurrentStep('completed'), 1500);
  };

  // После выбора скина запускаем финальный лоадер, затем завершаем настройку
  // const handleModalClose = () => {
  //   //closeModal(MODALS.DAYS_IN_A_ROW)
  //   saveCurrentStep('final_loading');
  //   setTimeout(() => saveCurrentStep('completed'), 1500);
  // };

  // Запрос fullscreen для Telegram WebApp
  useEffect(() => {
    if (
      window?.Telegram &&
      window?.Telegram?.WebApp &&
      typeof window?.Telegram?.WebApp?.requestFullscreen === 'function' &&
      !buildMode.includes('Dev')
    ) {
      window?.Telegram?.WebApp?.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const initAuthFlow = async () => {
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 3500));
      const savedStep = localStorage.getItem('currentSetupStep') as AuthStep || 'loading';

      try {
        await minLoadingTime;

        if (!localStorage.getItem('access_token')) {
          const [ authResponse ] = await Promise.all([ performSignIn(signIn), minLoadingTime ]);
          updateTokens(authResponse);
        }

        if (localStorage.getItem('setupCompleted') === '1') {
          saveCurrentStep('completed');
          return;
        }

        saveCurrentStep(savedStep && savedStep !== 'loading' ? savedStep : 'language');
      } catch (err: any) {
        console.error('Ошибка при инициализации:', err);
        if (savedStep === 'completed') {
          if (err?.status === 401 || err?.status === 403) {
            saveCurrentStep('invite_code');
          } else {
            saveCurrentStep('completed');
          }
        } else {
          saveCurrentStep('language');
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initAuthFlow();
  }, [ signIn, updateTokens, saveCurrentStep ]);

  return {
    currentStep,
    isLoading: false,
    isInitializing,
    isAnimationFinished,
    setIsAnimationFinished,
    selectedLanguage,
    handleLanguageSelect,
    handleLanguageContinue,
    handleInviteCodeContinue,
    handleSkinContinue,
    //handleModalClose
  };
};
