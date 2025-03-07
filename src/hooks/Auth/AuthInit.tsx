import React, { useEffect, useState } from 'react';
import { LoadingScreen } from '../../components/shared/LoadingScreen';
import { LanguageSelect } from '../../pages/LanguageSelect';
import { SkinSetupPage } from '../../pages/SkinSetupPage';
import { EnterInviteCodePage } from '../../pages/EnterInviteCodePage';
import { useAuthFlow } from './useAuthFlow.ts';
import Lottie from 'lottie-react';
import { coinsAnim } from '../../assets/animations';
// import WebApp from '@twa-dev/sdk'
import { useWebApp } from '../useWebApp.ts';


type AuthInitProps = {
  children: React.ReactNode;
};

export function AuthInit({ children }: AuthInitProps) {
  useWebApp()
  const {
    currentStep,
    isLoading,
    isInitializing,
    isAnimationFinished,
    setIsAnimationFinished,
    selectedLanguage,
    handleLanguageSelect,
    handleLanguageContinue,
    handleInviteCodeContinue,
    handleSkinContinue,
    //handleModalClose
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
          // referral_id={WebApp.initDataUnsafe.user?.id ?? 0}
          referral_id={window.Telegram.WebApp.initDataUnsafe.user.id}
          // referral_id={563486774}
          // referral_id={1259832544}
          //  referral_id={1301940582}
        />
      );

    case 'final_loading':
      return <LoadingScreen isAuthComplete={!isLoading && loadingStarted} onAnimationComplete={() => setIsAnimationFinished(true)} />;

    case 'skin':
      return <SkinSetupPage onContinue={handleSkinContinue} />;

    // case 'push_line' :
    //   return <DaysInARowModal onClose={handleModalClose} />;

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