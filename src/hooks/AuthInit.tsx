import React, { useEffect, useState } from 'react';
import { LoadingScreen } from '../components/shared/LoadingScreen';
import { LanguageSelect } from '../pages/LanguageSelect';
import { SkinSetupPage } from '../pages/SkinSetupPage';
import { EnterInviteCodePage } from '../pages/EnterInviteCodePage';
import DaysInARowModal from '../pages/DevModals/DaysInARowModal/DaysInARowModal';
import { useAuthFlow } from './useAuthFlow';
import Lottie from 'lottie-react';
import { coinsAnim } from '../assets/animations';

type AuthInitProps = {
  children: React.ReactNode;
};

export function AuthInit({ children }: AuthInitProps) {
  const {
    currentStep,
    isLoading,
    isInitializing,
    isAnimationFinished,
    setIsAnimationFinished,
    selectedLanguage,
    // currentUserTelegramId,
    isError,
    error,
    handleLanguageSelect,
    handleLanguageContinue,
    handleInviteCodeContinue,
    handleSkinContinue,
    handleModalClose,
  } = useAuthFlow();

  const [loadingStarted, setLoadingStarted] = useState(false);
  const [coinsAnimationShown, setCoinstAnimationShown] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setLoadingStarted(true);
    }
  }, [isLoading]);

  if (isLoading || isInitializing || !isAnimationFinished) {
    return <LoadingScreen isAuthComplete={!isLoading && loadingStarted} onAnimationComplete={() => setIsAnimationFinished(true)} />;
  }

  

  if (isError) {
    return <div style={{ color: 'red' }}>Ошибка при авторизации: {String(error)}</div>;
  }

  switch (currentStep) {
    case 'loading':
      return <LoadingScreen isAuthComplete={!isLoading && loadingStarted} onAnimationComplete={() => setIsAnimationFinished(true)} />;

    case 'language':
      return (
        <LanguageSelect
          selectedLanguage={selectedLanguage}
          onLanguageSelect={handleLanguageSelect}
          onContinue={handleLanguageContinue}
        />
      );

    case 'invite_code':
      return (
        <EnterInviteCodePage
          onContinue={handleInviteCodeContinue}
          referral_id={window.Telegram.WebApp.initData.user.id}
          // referral_id={currentUserTelegramId ?? 0}
        />
      );

    case 'signin':
      return <LoadingScreen isAuthComplete={!isLoading && loadingStarted} onAnimationComplete={() => setIsAnimationFinished(true)} />;

    case 'skin':
      return <SkinSetupPage onContinue={handleSkinContinue} />;

    case 'push':
      return <DaysInARowModal onClose={handleModalClose} />;

    case 'completed':
      return <>
        {!coinsAnimationShown &&
          <Lottie animationData={coinsAnim} loop={false} autoPlay={true} 
            style={{ zIndex: '10000', position: 'absolute' }}
            onComplete={
              () => {
                setCoinstAnimationShown(true);
              }
            } />}
        {children}
      </>;

    default:
      return <LoadingScreen isAuthComplete={!isLoading && loadingStarted} onAnimationComplete={() => setIsAnimationFinished(true)} />;
  }
}