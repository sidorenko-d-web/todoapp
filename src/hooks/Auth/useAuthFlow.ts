import { useEffect, useState } from 'react';
import { useSignInMutation } from '../../redux';
import { useTranslation } from 'react-i18next';
import { performSignIn } from './authService';
import { AuthStep } from './typesAuth.ts';
// import { useModal } from '../useModal.ts';
// import { MODALS } from '../../constants';

export const useAuthFlow = () => {
  const { i18n } = useTranslation();
  const [signIn] = useSignInMutation();
  const [currentStep, setCurrentStep] = useState<AuthStep>('loading');
  const [selectedLanguage, setSelectedLanguage] = useState(
    () => localStorage.getItem('selectedLanguage') || 'en'
  );
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
 // const { closeModal, openModal } = useModal();

  const saveCurrentStep = (step: AuthStep) => {
    if (step !== 'loading') {
      localStorage.setItem('currentSetupStep', step);
    }
    setCurrentStep(step);
  };

  // Выбор языка
  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    await i18n.changeLanguage(language);
  };

  // После выбора языка переходим либо к вводу invite_code, либо сразу к выбору скина
  const handleLanguageContinue = async () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!accessToken || !refreshToken) {
      saveCurrentStep('invite_code');
      return;
    }

    saveCurrentStep('skin');
  };

  const handleInviteCodeContinue = async () => {
    try {
      const authResponse = await performSignIn(signIn);
      localStorage.setItem('access_token', authResponse.access_token);
      localStorage.setItem('refresh_token', authResponse.refresh_token);
      saveCurrentStep('skin');
    } catch (err: any) {
      console.error('Ошибка при авторизации:', err);
      // Если ошибка 401 или 403 – остаемся на шаге invite_code
      if (err?.status === 401 || err?.status === 403) {
        alert('Неверный invite-код. Попробуйте снова.');
      } else {
        alert('Произошла ошибка. Попробуйте позже.');
      }
    }
  };

  const handleSkinContinue = () => {
    // saveCurrentStep('push_line');
    // openModal(MODALS.DAYS_IN_A_ROW)

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
      window.Telegram &&
      window.Telegram.WebApp &&
      typeof window.Telegram.WebApp.requestFullscreen === 'function'
    ) {
      window.Telegram.WebApp.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const initAuthFlow = async () => {
      const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 3500));
      const savedStep = localStorage.getItem('currentSetupStep') as AuthStep;

      const authResponse = await performSignIn(signIn);
      localStorage.setItem('access_token', authResponse.access_token);
      localStorage.setItem('refresh_token', authResponse.refresh_token);
      
      try {
        const hasCompletedSetup = savedStep === 'completed';
        await minLoadingTime;

        if (hasCompletedSetup) {
          saveCurrentStep('completed');
        } else if (savedStep && savedStep !== 'loading') {
          saveCurrentStep(savedStep);
        } else {
          saveCurrentStep('language');
        }

      } catch (err: any) {
        await minLoadingTime;
        console.error('Ошибка при инициализации:', err);
        saveCurrentStep('language');
      } finally {
        setIsInitializing(false);
      }
    };

    initAuthFlow();
  }, []);

  return {
    currentStep,
    isLoading: false, // При необходимости можно связать с состоянием загрузки мутации
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
