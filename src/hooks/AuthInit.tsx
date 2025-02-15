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

        const init_data = `query_id%3DAAEYoFtBAAAAABigW0G_6mBe%26user%3D%257B%2522id%2522%253A1096523800%252C%2522first_name%2522%253A%2522%25D0%2594%25D0%25BC%25D0%25B8%25D1%2582%25D1%2580%25D0%25B8%25D0%25B9%2522%252C%2522last_name%2522%253A%2522%25D0%25A1%25D0%25B8%25D0%25B4%25D0%25BE%25D1%2580%25D0%25B5%25D0%25BD%25D0%25BA%25D0%25BE%2522%252C%2522username%2522%253A%2522big_banka%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FUIap5sUEQ_kQmYD3jRj-ne9SxNjI5c3BYBgY6A_pxBk.svg%2522%257D%26auth_date%3D1738064202%26signature%3Ddvpa79sYVtw8twVoRcHu-w0AYh-bz7pg0G6uM1wl3x9TuBJS2mucaSINijOLf9EDrQK0ehAXQwAtSBjVeFsfDA%26hash%3D04d4cdc1296901e411621ca7b16cf2ea6fd2ac62ac6d13734509e79d53fc3582&tgWebAppVersion=8.0&tgWebAppPlatform=weba&tgWebAppThemeParams=%7B"bg_color"%3A"%23212121"%2C"text_color"%3A"%23ffffff"%2C"hint_color"%3A"%23aaaaaa"%2C"link_color"%3A"%238774e1"%2C"button_color"%3A"%238774e1"%2C"button_text_color"%3A"%23ffffff"%2C"secondary_bg_color"%3A"%230f0f0f"%2C"header_bg_color"%3A"%23212121"%2C"accent_text_color"%3A"%238774e1"%2C"section_bg_color"%3A"%23212121"%2C"section_header_text_color"%3A"%23aaaaaa"%2C"subtitle_text_color"%3A"%23aaaaaa"%2C"destructive_text_color"%3A"%23e53935"%7D`;

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