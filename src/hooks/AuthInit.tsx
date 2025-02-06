import React, { useEffect, useState } from 'react';
import { useSignInMutation } from '../redux';
import { LoadingScreen } from '../components/shared/LoadingScreen';
import { LanguageSelect } from '../pages/LanguageSelect';
import { SkinSetupPage } from '../pages/SkinSetupPage';

type AuthInitProps = {
  children: React.ReactNode;
};

type AuthStep = 'loading' | 'language' | 'skin' | 'completed';

export function AuthInit({ children }: AuthInitProps) {
  const [signIn, { isLoading, isError, error }] = useSignInMutation();
  const [currentStep, setCurrentStep] = useState<AuthStep>('loading');
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('selectedLanguage') || 'en';
  });
  const [isInitializing, setIsInitializing] = useState(true);

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

        //const init_data = `query_id%3DAAEYoFtBAAAAABigW0HEY3G4%26user%3D%257B%2522id%2522%253A1096523800%252C%2522first_name%2522%253A%2522%25D0%2594%25D0%25BC%25D0%25B8%25D1%2582%25D1%2580%25D0%25B8%25D0%25B9%2522%252C%2522last_name%2522%253A%2522%25D0%25A1%25D0%25B8%25D0%25B4%25D0%25BE%25D1%2580%25D0%25B5%25D0%25BD%25D0%25BA%25D0%25BE%2522%252C%2522username%2522%253A%2522big_banka%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FUIap5sUEQ_kQmYD3jRj-ne9SxNjI5c3BYBgY6A_pxBk.svg%2522%257D%26auth_date%3D1738583829%26signature%3DvsWWDe7kSKXuryOOLFK-MDMP0mUvYStVUgYg7air_ynlROUJ57e9kA3mJ4ABc8qh1Jg06PbFWuvhBRllefVKCQ%26hash%3Da90a34411b3ba2d2f1fdd5d2d7f23718b9bdf4f47ac581a9cf63425d293b38e4&tgWebAppVersion=8.0&tgWebAppPlatform=weba&tgWebAppThemeParams=%7B"bg_color"%3A"%23212121"%2C"text_color"%3A"%23ffffff"%2C"hint_color"%3A"%23aaaaaa"%2C"link_color"%3A"%238774e1"%2C"button_color"%3A"%238774e1"%2C"button_text_color"%3A"%23ffffff"%2C"secondary_bg_color"%3A"%230f0f0f"%2C"header_bg_color"%3A"%23212121"%2C"accent_text_color"%3A"%238774e1"%2C"section_bg_color"%3A"%23212121"%2C"section_header_text_color"%3A"%23aaaaaa"%2C"subtitle_text_color"%3A"%23aaaaaa"%2C"destructive_text_color"%3A"%23e53935"%7D`;
        const init_data = "query_id=AAEJqZMZAAAAAAmpkxlmc6BB&user=%7B%22id%22%3A429107465%2C%22first_name%22%3A%22Kiryl%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22UseNameKiryl%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FRBi5fqzvkaFYBv7fi7y6iDpojRJtZPm9dHKm_PjZ-5U.svg%22%7D&auth_date=1738838231&signature=UZSBSxBZ3aZ6ZIpKRfEBQgHpmJRvzEQIuV3VgUBVywQFcjjjVS0gflIduoryZMLLjEfaleU0FB4ShxP_lsCqDQ&hash=060cc269cf713980d37bebfa1fb9386629e670b5267d9fd9730cd925f322a821"
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

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
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
