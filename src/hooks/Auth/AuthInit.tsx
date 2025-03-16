import React, { Suspense, useEffect, useState } from 'react';
import { LoadingScreen } from '../../components/shared/LoadingScreen';
import { LanguageSelect } from '../../pages/LanguageSelect';
import { SkinSetupPage } from '../../pages/SkinSetupPage';
import { EnterInviteCodePage } from '../../pages/EnterInviteCodePage';
import { useAuthFlow } from './useAuthFlow.ts';
import Lottie from 'lottie-react';
import { coinsAnim } from '../../assets/animations';
// import WebApp from '@twa-dev/sdk';
import { useWebApp } from '../useWebApp.ts';

type AuthInitProps = {
  children: React.ReactNode;
};

export function AuthInit({ children }: AuthInitProps) {
  useWebApp();
  const {
    currentStep,
    isLoading,
    isInitializing,
    isAnimationFinished,
    setIsAnimationFinished,
    selectedLanguage,
    handleLanguageSelect,
    handleLanguageContinue,
    handleSkinContinue,
    handleInviteCodeContinue,
    //handleModalClose
  } = useAuthFlow();

  const [loadingStarted, setLoadingStarted] = useState(false);
  const [coinsAnimationShown, setCoinstAnimationShown] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setLoadingStarted(true);
    }
  }, [isLoading]);

  const shouldShowLoading =
    isLoading ||
    isInitializing ||
    !isAnimationFinished ||
    currentStep === 'loading' ||
    currentStep === 'final_loading';

  if (shouldShowLoading) {
    return (
      <LoadingScreen
        isAuthComplete={!isLoading && loadingStarted}
        onAnimationComplete={() => setIsAnimationFinished(true)}
      />
    );
  }

  return (
    <Suspense fallback={<LoadingScreen isAuthComplete={false} onAnimationComplete={() => {}} />}>
      {currentStep === 'language' && (
        <LanguageSelect
          selectedLanguage={selectedLanguage}
          onLanguageSelect={handleLanguageSelect}
          onContinue={handleLanguageContinue}
        />
      )}
      {currentStep === 'invite_code' && (
        <EnterInviteCodePage
          onContinue={handleInviteCodeContinue}
          // referral_id={WebApp.initDataUnsafe.user?.id ?? 0}
          referral_id={window.Telegram.WebApp.initDataUnsafe.user.id}
          // referral_id={1259832544}
          // referral_id={1301940582}
          // referral_id={6547551264}
          // referral_id={1488618801}
          // referral_id={6475086298}
          // referral_id={6983657401}
        />
      )}
      {currentStep === 'skin' && <SkinSetupPage onContinue={handleSkinContinue} />}
      {currentStep === 'completed' && (
        <>
          {!coinsAnimationShown && (
            <Lottie
              animationData={coinsAnim}
              loop={false}
              autoPlay
              style={{ zIndex: 10000, position: 'absolute' }}
              onComplete={() => setCoinstAnimationShown(true)}
            />
          )}
          {children}
        </>
      )}
      {/* Если ни один из кейсов не подошёл, показываем LoadingScreen */}
      {!['language', 'invite_code', 'skin', 'completed'].includes(currentStep) && (
        <LoadingScreen
          isAuthComplete={!isLoading && loadingStarted}
          onAnimationComplete={() => setIsAnimationFinished(true)}
        />
      )}
    </Suspense>
  );
}
