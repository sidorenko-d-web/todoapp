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

  useEffect(() => {
    if (
      window.Telegram &&
      window.Telegram.WebApp &&
      typeof window.Telegram.WebApp.requestFullscreen === 'function'
    ) {
      window.Telegram.WebApp.requestFullscreen();
    }
  }, []);

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

        //const init_data = window.Telegram.WebApp.initData;

        //const init_data = `query_id%3DAAHa-fEBAwAAANr58QFFg6SM%26user%3D%257B%2522id%2522%253A6475086298%252C%2522first_name%2522%253A%2522%25D0%2590%25D0%25BD%25D0%25B4%25D1%2580%25D0%25B5%25D0%25B9%2522%252C%2522last_name%2522%253A%2522%25D0%2593%25D0%25B5%25D1%2580%25D0%25B0%25D1%2581%25D0%25B8%25D0%25BC%25D0%25BE%25D0%25B2%2522%252C%2522username%2522%253A%2522De_Geras%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FGzJ9TEsOx7Oc1JJcHr-lzeFQB6alew8O_qoBdhO-6gGt7kZEiGJ6urTqgGlF9_Ye.svg%2522%257D%26auth_date%3D1739263999%26signature%3D6Nc44J8mpAyftuBwiEXHF3YyBtkbAptwj1YO0P99Dhmkpy1G1Nw8wxfR48B22hnqfGPnxxrf9vcSenT5ylpACg%26hash%3D90880b7f94adbd34cac6cd5d023fc5822c26b6d3036709f5dd60f547d2889a2c&tgWebAppVersion=7.2&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22button_text_color%22%3A%22%23ffffff%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22link_color%22%3A%22%23007aff%22%2C%22section_header_text_color%22%3A%22%23e5e5e5%22%2C%22button_color%22%3A%22%23007aff%22%2C%22subtitle_text_color%22%3A%22%23ffffff%22%2C%22bg_color%22%3A%22%23282828%22%2C%22accent_text_color%22%3A%22%23007aff%22%2C%22secondary_bg_color%22%3A%22%231c1c1c%22%2C%22destructive_text_color%22%3A%22%23ff453a%22%2C%22header_bg_color%22%3A%22%231c1c1c%22%2C%22section_bg_color%22%3A%22%23282828%22%2C%22hint_color%22%3A%22%23ffffff%22%7D`;
        // const init_data = window.Telegram.WebApp.initData;

        //const init_data = `query_id%3DAAHa-fEBAwAAANr58QFFg6SM%26user%3D%257B%2522id%2522%253A6475086298%252C%2522first_name%2522%253A%2522%25D0%2590%25D0%25BD%25D0%25B4%25D1%2580%25D0%25B5%25D0%25B9%2522%252C%2522last_name%2522%253A%2522%25D0%2593%25D0%25B5%25D1%2580%25D0%25B0%25D1%2581%25D0%25B8%25D0%25BC%25D0%25BE%25D0%25B2%2522%252C%2522username%2522%253A%2522De_Geras%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FGzJ9TEsOx7Oc1JJcHr-lzeFQB6alew8O_qoBdhO-6gGt7kZEiGJ6urTqgGlF9_Ye.svg%2522%257D%26auth_date%3D1739263999%26signature%3D6Nc44J8mpAyftuBwiEXHF3YyBtkbAptwj1YO0P99Dhmkpy1G1Nw8wxfR48B22hnqfGPnxxrf9vcSenT5ylpACg%26hash%3D90880b7f94adbd34cac6cd5d023fc5822c26b6d3036709f5dd60f547d2889a2c&tgWebAppVersion=7.2&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22button_text_color%22%3A%22%23ffffff%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22link_color%22%3A%22%23007aff%22%2C%22section_header_text_color%22%3A%22%23e5e5e5%22%2C%22button_color%22%3A%22%23007aff%22%2C%22subtitle_text_color%22%3A%22%23ffffff%22%2C%22bg_color%22%3A%22%23282828%22%2C%22accent_text_color%22%3A%22%23007aff%22%2C%22secondary_bg_color%22%3A%22%231c1c1c%22%2C%22destructive_text_color%22%3A%22%23ff453a%22%2C%22header_bg_color%22%3A%22%231c1c1c%22%2C%22section_bg_color%22%3A%22%23282828%22%2C%22hint_color%22%3A%22%23ffffff%22%7D`;

        const init_data = 'query_id=AAEJqZMZAAAAAAmpkxme6jSA&user=%7B%22id%22%3A429107465%2C%22first_name%22%3A%22Kiryl%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22UseNameKiryl%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FRBi5fqzvkaFYBv7fi7y6iDpojRJtZPm9dHKm_PjZ-5U.svg%22%7D&auth_date=1739359084&signature=9qlTaVZXAb3xGsg238igZKrhr205XifTQvuhh1Fab0M_yXY5jgyQK55ORVCIXnj04ldTsm4GUyhh1fMfY2YyCA&hash=deeb159e958d25a03b671bd3e90afafc834fe15f2f51238c6b5a9c25ada04791'
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
