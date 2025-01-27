import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSignInMutation } from '../redux';
import { LoadingScreen } from '../components/shared/LoadingScreen';
import { LanguageSelect } from '../pages/LanguageSelect/LanguageSelect';
import { SkinSetupPage } from '../pages/SkinSetupPage/SkinSetupPage';

type AuthInitProps = {
  children: React.ReactNode;
};

type AuthStep = 'loading' | 'language' | 'skin' | 'completed';

export function AuthInit({ children }: AuthInitProps) {
  const [signIn, { isLoading, isError, error }] = useSignInMutation();
  const [currentStep, setCurrentStep] = useState<AuthStep>('loading');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const ipData = await axios.get('https://ipapi.co/json/').then(res => res.data);
        // const init_data = window.Telegram.WebApp.initData;
        const init_data = "query_id%3DAAHa-fEBAwAAANr58QFkP1lV%26user%3D%257B%2522id%2522%253A6475086298%252C%2522first_name%2522%253A%2522%25D0%2590%25D0%25BD%25D0%25B4%25D1%2580%25D0%25B5%25D0%25B9%2522%252C%2522last_name%2522%253A%2522%25D0%2593%25D0%25B5%25D1%2580%25D0%25B0%25D1%2581%25D0%25B8%25D0%25BC%25D0%25BE%25D0%25B2%2522%252C%2522username%2522%253A%2522De_Geras%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FGzJ9TEsOx7Oc1JJcHr-lzeFQB6alew8O_qoBdhO-6gGt7kZEiGJ6urTqgGlF9_Ye.svg%2522%257D%26auth_date%3D1737553293%26signature%3D8_Ghv6rhUKC-V-8rlrIrARtiuAPSOyVN_uzP3LXfQBHnj4RRBGnmi7TwLZVfbGFTgPO4Sgv48Bz_jAyvW3oPAA%26hash%3D9b2d6a17b75c7f860c38048f47ec609892af6edba1117df226c4e93fe75ca7b8&tgWebAppVersion=7.2&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22header_bg_color%22%3A%22%231c1c1c%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22section_header_text_color%22%3A%22%23e5e5e5%22%2C%22hint_color%22%3A%22%23ffffff%22%2C%22link_color%22%3A%22%23007aff%22%2C%22bg_color%22%3A%22%23282828%22%2C%22destructive_text_color%22%3A%22%23ff453a%22%2C%22button_color%22%3A%22%23007aff%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22secondary_bg_color%22%3A%22%231c1c1c%22%2C%22accent_text_color%22%3A%22%23007aff%22%2C%22subtitle_text_color%22%3A%22%23ffffff%22%2C%22section_bg_color%22%3A%22%23282828%22%7D";

        const authResponse = await signIn({
          init_data,
          ip: ipData.ip,
          country: ipData.country,
        }).unwrap();

        localStorage.setItem('access_token', authResponse.access_token);
        localStorage.setItem('refresh_token', authResponse.refresh_token);
        
        // Добавляем задержку в 2 секунды перед переходом к следующему шагу пока временно
        setTimeout(() => {
          setShowLoading(false);
          setCurrentStep('language');
        }, 2000);
        
      } catch (err) {
        console.error('Ошибка при авторизации:', err);
        setShowLoading(false);
      }
    };

    initAuth();
  }, [signIn]);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleLanguageContinue = () => {
    setCurrentStep('skin');
  };

  const handleSkinContinue = () => {
    setCurrentStep('completed');
  };

  if (isLoading || showLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <div style={{ color: 'red' }}>Ошибка при авторизации: {String(error)}</div>;
  }

  switch (currentStep) {
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
      return null;
  }
}