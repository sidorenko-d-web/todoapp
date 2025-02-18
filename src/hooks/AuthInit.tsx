import React, { useEffect, useState } from 'react';
import { useSignInMutation } from '../redux';
import { LoadingScreen } from '../components/shared/LoadingScreen';
import { LanguageSelect } from '../pages/LanguageSelect';
import { SkinSetupPage } from '../pages/SkinSetupPage';
import { useTranslation } from 'react-i18next';

type AuthInitProps = {
  children: React.ReactNode;
};

type AuthStep = 'loading' | 'language' | 'skin' | 'completed';

export function AuthInit({ children }: AuthInitProps) {
  const { i18n } = useTranslation();
  const [signIn, { isLoading, isError, error }] = useSignInMutation();
  const [currentStep, setCurrentStep] = useState<AuthStep>('loading');
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('selectedLanguage') || 'en';
  });
  const [isInitializing, setIsInitializing] = useState(true);

  // useEffect(() => {
  //   if (
  //     window.Telegram &&
  //     window.Telegram.WebApp &&
  //     typeof window.Telegram.WebApp.requestFullscreen === 'function'
  //   ) {
  //     window.Telegram.WebApp.requestFullscreen();
  //   }
  // }, []);

  const saveCurrentStep = (step: AuthStep) => {
    if (step !== 'loading') {
      localStorage.setItem('currentSetupStep', step);
    }
    setCurrentStep(step);
  };

  useEffect(() => {
    const initAuth = async () => {
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

      try {
        const hasCompletedSetup = localStorage.getItem('hasCompletedSetup');
        const savedStep = localStorage.getItem('currentSetupStep') as AuthStep;

        // const init_data = window.Telegram.WebApp.initData;

        const init_data = `query_id%3DAAEJqZMZAAAAAAmpkxn-N6z4%26user%3D%257B%2522id%2522%253A429107465%252C%2522first_name%2522%253A%2522Kiryl%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522UseNameKiryl%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FRBi5fqzvkaFYBv7fi7y6iDpojRJtZPm9dHKm_PjZ-5U.svg%2522%257D%26auth_date%3D1739880824%26signature%3Dj8GFa3r-RuPe-cU2J6D-pzDemh44PVnnWxUSz5SjTzZPuXlK1CH5HU_wI8Quo35lXpBIy6YSvOjp7Efm1SXwBQ%26hash%3D2725884d5176ed34aa0e04b1caca7ceca291facd49e541060cb2a1cc005335a9`;

        const authResponse = await signIn({
          init_data,
        }).unwrap();

        localStorage.setItem('access_token', authResponse.access_token);
        localStorage.setItem('refresh_token', authResponse.refresh_token);

        await minLoadingTime;

        if (hasCompletedSetup) {
          saveCurrentStep('completed');
        } else if (savedStep && savedStep !== 'loading') {
          saveCurrentStep(savedStep);
        } else {
          saveCurrentStep('language');
        }
        setIsInitializing(false);
      } catch (err) {
        await minLoadingTime;

        console.error('Ошибка при авторизации:', err);
        setIsInitializing(false);
        const savedStep = localStorage.getItem('currentSetupStep') as AuthStep;
        if (savedStep && savedStep !== 'loading') {
          saveCurrentStep(savedStep);
        } else {
          saveCurrentStep('language');
        }
      }
    };

    initAuth();
  }, [signIn]);

  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    await i18n.changeLanguage(language);
  };

  const handleLanguageContinue = () => {
    saveCurrentStep('skin');
  };

  const handleSkinContinue = () => {
    localStorage.setItem('hasCompletedSetup', 'true');
    localStorage.removeItem('currentSetupStep');
    saveCurrentStep('completed');
  };

  if (isLoading || isInitializing) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <div style={{ color: 'red' }}>Ошибка при авторизации: {String(error)}</div>;
  }
  switch (currentStep) {
    case 'loading':
      return <LoadingScreen />;

    case 'language':
      return (
        <LanguageSelect
          selectedLanguage={selectedLanguage}
          onLanguageSelect={handleLanguageSelect}
          onContinue={handleLanguageContinue}
        />
      );

    case 'skin':
      return <SkinSetupPage onContinue={handleSkinContinue} />;

    case 'completed':
      return <>{children}</>;

    default:
      return <LoadingScreen />;
  }
}