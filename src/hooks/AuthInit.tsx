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

        const init_data = 
        "query_id=AAEJqZMZAAAAAAmpkxluA12V&user=%7B%22id%22%3A429107465%2C%22first_name%22%3A%22Kiryl%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22UseNameKiryl%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FRBi5fqzvkaFYBv7fi7y6iDpojRJtZPm9dHKm_PjZ-5U.svg%22%7D&auth_date=1738663277&signature=tnVGXH_l5-MfNwSqvAuWUIAnCvU-0XbBO8ZWDxyZUqwYgvd4JcEI6Rf3P9wxO8nF7sFVU_eRCKj65bPiX4OvDQ&hash=c1c1a3bc876c5318043e700a988842dc3114e5582caf9c554a399a6457519304";
        
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

