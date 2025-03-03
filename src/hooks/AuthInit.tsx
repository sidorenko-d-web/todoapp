import React from 'react';
import { LoadingScreen } from '../components/shared/LoadingScreen';
import { LanguageSelect } from '../pages/LanguageSelect';
import { SkinSetupPage } from '../pages/SkinSetupPage';
import { EnterInviteCodePage } from '../pages/EnterInviteCodePage';
import DaysInARowModal from '../pages/DevModals/DaysInARowModal/DaysInARowModal';
import { useAuthFlow } from './useAuthFlow';
import WebApp from '@twa-dev/sdk'

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

  if (isLoading || isInitializing || !isAnimationFinished) {
    return <LoadingScreen onAnimationComplete={() => setIsAnimationFinished(true)} />;
  }

  if (isError) {
    return <div style={{ color: 'red' }}>Ошибка при авторизации: {String(error)}</div>;
  }

  switch (currentStep) {
    case 'loading':
      return <LoadingScreen onAnimationComplete={() => setIsAnimationFinished(true)} />;

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
          referral_id={WebApp.initDataUnsafe.user?.id ?? 0}
          // referral_id={window.Telegram.WebApp.initDataUnsafe.user.id}
          // referral_id={563486774}
        />
      );

    case 'signin':
      return <LoadingScreen onAnimationComplete={() => setIsAnimationFinished(true)} />;

    case 'skin':
      return <SkinSetupPage onContinue={handleSkinContinue} />;

    case 'push':
      return <DaysInARowModal onClose={handleModalClose} />;

    case 'completed':
      return <>{children}</>;

    default:
      return <LoadingScreen onAnimationComplete={() => setIsAnimationFinished(true)} />;
  }
}
