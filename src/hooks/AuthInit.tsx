import React, { useEffect, useState } from 'react';
import { useGetUserQuery, useSignInMutation } from '../redux';
import { LoadingScreen } from '../components/shared/LoadingScreen';
import { LanguageSelect } from '../pages/LanguageSelect';
import { SkinSetupPage } from '../pages/SkinSetupPage';
import { useTranslation } from 'react-i18next';
import { EnterInviteCodePage } from '../pages/EnterInviteCodePage';
import { MODALS } from '../constants';
import DaysInARowModal from '../pages/DevModals/DaysInARowModal/DaysInARowModal.tsx';
import { useModal } from './useModal.ts';
import { extractTelegramIdFromInitData } from '../utils';
import Lottie from 'lottie-react';
import { coinsAnim } from '../assets/animations/imports.ts';

type AuthInitProps = {
  children: React.ReactNode;
};

type AuthStep = 'loading' | 'language' | 'invite_code' | 'signin' | 'skin' | 'push' | 'completed';

export function AuthInit({ children }: AuthInitProps) {
  const { i18n } = useTranslation();
  const [signIn, { isLoading, isError, error }] = useSignInMutation();
  const {isError: isUsersError} = useGetUserQuery() // Нужно для проверки access token
  const [currentStep, setCurrentStep] = useState<AuthStep>('loading');
  const { closeModal, openModal } = useModal();
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('selectedLanguage') || 'en';
  });
  const [isInitializing, setIsInitializing] = useState(true);
  const [loadingStarted, setLoadingStarted] = useState(false);
  const [coinsAnimationShown, setCoinstAnimationShown] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setLoadingStarted(true);
    }
  }, [isLoading]);

  // телеграм айди текущего пользователя, нужно для реферального кода
  const [currentUserTelegramId, setCurrentUserTelegramId] = useState<number | null>(null);

  useEffect(() => {
    if (
      window.Telegram &&
      window.Telegram.WebApp &&
      typeof window.Telegram.WebApp.requestFullscreen === 'function'
    ) {
      window.Telegram.WebApp.requestFullscreen();
    }
  }, []);


  const [isAnimationFinished, setIsAnimationFinished] = useState(false);

  const saveCurrentStep = (step: AuthStep) => {
    if (step !== 'loading') {
      localStorage.setItem('currentSetupStep', step);
    }
    setCurrentStep(step);
  };

  // Нужно для проверки access token
  const isTokenValid = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    if (isUsersError) {
      return false
    }
    return true
  }

  useEffect(() => {
    const initAuth = async () => {
      //const minLoadingTime = new Promise(resolve => setTimeout(resolve, 3500));

      try {
        const hasCompletedSetup = localStorage.getItem('hasCompletedSetup');
        const savedStep = localStorage.getItem('currentSetupStep') as AuthStep;

        // const init_data = window.Telegram.WebApp.initData;

        //const init_data = `query_id%3DAAHa-fEBAwAAANr58QFFg6SM%26user%3D%257B%2522id%2522%253A6475086298%252C%2522first_name%2522%253A%2522%25D0%2590%25D0%25BD%25D0%25B4%25D1%2580%25D0%25B5%25D0%25B9%2522%252C%2522last_name%2522%253A%2522%25D0%2593%25D0%25B5%25D1%2580%25D0%25B0%25D1%2581%25D0%25B8%25D0%25BC%25D0%25BE%25D0%25B2%2522%252C%2522username%2522%253A%2522De_Geras%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FGzJ9TEsOx7Oc1JJcHr-lzeFQB6alew8O_qoBdhO-6gGt7kZEiGJ6urTqgGlF9_Ye.svg%2522%257D%26auth_date%3D1739263999%26signature%3D6Nc44J8mpAyftuBwiEXHF3YyBtkbAptwj1YO0P99Dhmkpy1G1Nw8wxfR48B22hnqfGPnxxrf9vcSenT5ylpACg%26hash%3D90880b7f94adbd34cac6cd5d023fc5822c26b6d3036709f5dd60f547d2889a2c&tgWebAppVersion=7.2&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22button_text_color%22%3A%22%23ffffff%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22link_color%22%3A%22%23007aff%22%2C%22section_header_text_color%22%3A%22%23e5e5e5%22%2C%22button_color%22%3A%22%23007aff%22%2C%22subtitle_text_color%22%3A%22%23ffffff%22%2C%22bg_color%22%3A%22%23282828%22%2C%22accent_text_color%22%3A%22%23007aff%22%2C%22secondary_bg_color%22%3A%22%231c1c1c%22%2C%22destructive_text_color%22%3A%22%23ff453a%22%2C%22header_bg_color%22%3A%22%231c1c1c%22%2C%22section_bg_color%22%3A%22%23282828%22%2C%22hint_color%22%3A%22%23ffffff%22%7D`;
        // const init_data = 'query_id%3DAAFmCZpNAAAAAGYJmk2lHf3U%26user%3D%257B%2522id%2522%253A1301940582%252C%2522first_name%2522%253A%2522DeHopen%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522Dehopen%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252F1cxjHUxLtwio6PU0JD6u5txQhDUSCkufw8fUw9vOrZc.svg%2522%257D%26auth_date%3D1739808435%26signature%3DelBqutmHu0ehe3RR1_OBG2Z_sojd8NChAcLpdP_rnQ38ivT8QrBjtxsRyozteRaYB2_nulL9sYxaEMvFJsiqBA%26hash%3Dd099ffd45e27503ff67b3a88c5db16c4a9b7900a4fa78763cd8557cae5f8f899&tgWebAppVersion=8.0&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22destructive_text_color%22%3A%22%23ff453a%22%2C%22section_header_text_color%22%3A%22%23e5e5e5%22%2C%22bottom_bar_bg_color%22%3A%22%233e464c%22%2C%22secondary_bg_color%22%3A%22%231c1c1c%22%2C%22section_bg_color%22%3A%22%23282828%22%2C%22section_separator_color%22%3A%22%233d3d3d%22%2C%22bg_color%22%3A%22%23282828%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22header_bg_color%22%3A%22%231c1c1c%22%2C%22link_color%22%3A%22%23007aff%22%2C%22accent_text_color%22%3A%22%23007aff%22%2C%22subtitle_text_color%22%3A%22%23ffffff%22%2C%22button_color%22%3A%22%23007aff%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23ffffff%22%7D'
         const init_data = 'query_id=AAEJqZMZAAAAAAmpkxme6jSA&user=%7B%22id%22%3A429107465%2C%22first_name%22%3A%22Kiryl%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22UseNameKiryl%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FRBi5fqzvkaFYBv7fi7y6iDpojRJtZPm9dHKm_PjZ-5U.svg%22%7D&auth_date=1739359084&signature=9qlTaVZXAb3xGsg238igZKrhr205XifTQvuhh1Fab0M_yXY5jgyQK55ORVCIXnj04ldTsm4GUyhh1fMfY2YyCA&hash=deeb159e958d25a03b671bd3e90afafc834fe15f2f51238c6b5a9c25ada04791'
        // const init_data = `user=%7B%22id%22%3A6547551264%2C%22first_name%22%3A%22Marketer%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Marketer7%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FZXmZsLRfqSwjww-KJ6vKAk7MdaJgauVvTBeAA_9wyR69odwqAQOCVE4Lm46UHmKn.svg%22%7D&chat_instance=4040856596542184382&chat_type=sender&auth_date=1739961223&signature=tbB5zrbfTz_e4Tk_4m5sJ22NIP8xypK7QgzRxSZFmA5IHUBC6o81Z3GgSbreA958_DALVFYX02-KPXI3D5BoCw&hash=38c5fc18ed5a08db81194555a775bd92591e78ac82539840b4665cf8e6abfb6d`
        // const init_data = 'query_id%3DAAHa-fEBAwAAANr58QFFg6SM%26user%3D%257B%2522id%2522%253A6475086298%252C%2522first_name%2522%253A%2522%25D0%2590%25D0%25BD%25D0%25B4%25D1%2580%25D0%25B5%25D0%25B9%2522%252C%2522last_name%2522%253A%2522%25D0%2593%25D0%25B5%25D1%2580%25D0%25B0%25D1%2581%25D0%25B8%25D0%25BC%25D0%25BE%25D0%25B2%2522%252C%2522username%2522%253A%2522De_Geras%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FGzJ9TEsOx7Oc1JJcHr-lzeFQB6alew8O_qoBdhO-6gGt7kZEiGJ6urTqgGlF9_Ye.svg%2522%257D%26auth_date%3D1739263999%26signature%3D6Nc44J8mpAyftuBwiEXHF3YyBtkbAptwj1YO0P99Dhmkpy1G1Nw8wxfR48B22hnqfGPnxxrf9vcSenT5ylpACg%26hash%3D90880b7f94adbd34cac6cd5d023fc5822c26b6d3036709f5dd60f547d2889a2c&tgWebAppVersion=7.2&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22button_text_color%22%3A%22%23ffffff%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22link_color%22%3A%22%23007aff%22%2C%22section_header_text_color%22%3A%22%23e5e5e5%22%2C%22button_color%22%3A%22%23007aff%22%2C%22subtitle_text_color%22%3A%22%23ffffff%22%2C%22bg_color%22%3A%22%23282828%22%2C%22accent_text_color%22%3A%22%23007aff%22%2C%22secondary_bg_color%22%3A%22%231c1c1c%22%2C%22destructive_text_color%22%3A%22%23ff453a%22%2C%22header_bg_color%22%3A%22%231c1c1c%22%2C%22section_bg_color%22%3A%22%23282828%22%2C%22hint_color%22%3A%22%23ffffff%22%7D'
        // const init_data = 'query_id=AAEJqZMZAAAAAAmpkxme6jSA&user=%7B%22id%22%3A429107465%2C%22first_name%22%3A%22Kiryl%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22UseNameKiryl%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FRBi5fqzvkaFYBv7fi7y6iDpojRJtZPm9dHKm_PjZ-5U.svg%22%7D&auth_date=1739359084&signature=9qlTaVZXAb3xGsg238igZKrhr205XifTQvuhh1Fab0M_yXY5jgyQK55ORVCIXnj04ldTsm4GUyhh1fMfY2YyCA&hash=deeb159e958d25a03b671bd3e90afafc834fe15f2f51238c6b5a9c25ada04791'
        //const init_data = 'query_id=AAEJqZMZAAAAAAmpkxme6jSA&user=%7B%22id%22%3A429107465%2C%22first_name%22%3A%22Kiryl%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22UseNameKiryl%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FRBi5fqzvkaFYBv7fi7y6iDpojRJtZPm9dHKm_PjZ-5U.svg%22%7D&auth_date=1739359084&signature=9qlTaVZXAb3xGsg238igZKrhr205XifTQvuhh1Fab0M_yXY5jgyQK55ORVCIXnj04ldTsm4GUyhh1fMfY2YyCA&hash=deeb159e958d25a03b671bd3e90afafc834fe15f2f51238c6b5a9c25ada04791'
        // const init_data = `user=%7B%22id%22%3A6547551264%2C%22first_name%22%3A%22Marketer%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Marketer7%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FZXmZsLRfqSwjww-KJ6vKAk7MdaJgauVvTBeAA_9wyR69odwqAQOCVE4Lm46UHmKn.svg%22%7D&chat_instance=4040856596542184382&chat_type=sender&auth_date=1739961223&signature=tbB5zrbfTz_e4Tk_4m5sJ22NIP8xypK7QgzRxSZFmA5IHUBC6o81Z3GgSbreA958_DALVFYX02-KPXI3D5BoCw&hash=38c5fc18ed5a08db81194555a775bd92591e78ac82539840b4665cf8e6abfb6d`
        // const init_data = 'query_id%3DAAHa-fEBAwAAANr58QFFg6SM%26user%3D%257B%2522id%2522%253A6475086298%252C%2522first_name%2522%253A%2522%25D0%2590%25D0%25BD%25D0%25B4%25D1%2580%25D0%25B5%25D0%25B9%2522%252C%2522last_name%2522%253A%2522%25D0%2593%25D0%25B5%25D1%2580%25D0%25B0%25D1%2581%25D0%25B8%25D0%25BC%25D0%25BE%25D0%25B2%2522%252C%2522username%2522%253A%2522De_Geras%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FGzJ9TEsOx7Oc1JJcHr-lzeFQB6alew8O_qoBdhO-6gGt7kZEiGJ6urTqgGlF9_Ye.svg%2522%257D%26auth_date%3D1739263999%26signature%3D6Nc44J8mpAyftuBwiEXHF3YyBtkbAptwj1YO0P99Dhmkpy1G1Nw8wxfR48B22hnqfGPnxxrf9vcSenT5ylpACg%26hash%3D90880b7f94adbd34cac6cd5d023fc5822c26b6d3036709f5dd60f547d2889a2c&tgWebAppVersion=7.2&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22button_text_color%22%3A%22%23ffffff%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22link_color%22%3A%22%23007aff%22%2C%22section_header_text_color%22%3A%22%23e5e5e5%22%2C%22button_color%22%3A%22%23007aff%22%2C%22subtitle_text_color%22%3A%22%23ffffff%22%2C%22bg_color%22%3A%22%23282828%22%2C%22accent_text_color%22%3A%22%23007aff%22%2C%22secondary_bg_color%22%3A%22%231c1c1c%22%2C%22destructive_text_color%22%3A%22%23ff453a%22%2C%22header_bg_color%22%3A%22%231c1c1c%22%2C%22section_bg_color%22%3A%22%23282828%22%2C%22hint_color%22%3A%22%23ffffff%22%7D'

        const authResponse = await signIn({
          init_data,
        }).unwrap();

        localStorage.setItem('access_token', authResponse.access_token);
        localStorage.setItem('refresh_token', authResponse.refresh_token);

        // await minLoadingTime;

        if (hasCompletedSetup) {
          // For users who have completed setup, skip to completed state
          // They've already gone through the entire flow, including invite code
          // saveCurrentStep('completed');

          // Если токен валидный то можно ставить шаг completed
          if (isTokenValid()) {
            saveCurrentStep('completed');

          // Если срок действия токена истек, то авторизуемся
          } else {
            const success = await performAuthentication();
            if (success) {
              saveCurrentStep('completed');
            } else {
              saveCurrentStep('language');
            }
          }

        } else if (savedStep && savedStep !== 'loading') {
          // Resume from saved step for users in the middle of setup
          saveCurrentStep(savedStep);
        } else {
          // Start fresh for new users
          saveCurrentStep('language');
        }

        setIsInitializing(false);
      } catch (err) {
        // await minLoadingTime;
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
  }, []);


  const performAuthentication = async () => {
    try {
      // это расскоментить для билда
      // const init_data = window.Telegram.WebApp.initData;

      // Андрей dehopen
      //const init_data = 'query_id%3DAAFmCZpNAAAAAGYJmk2lHf3U%26user%3D%257B%2522id%2522%253A1301940582%252C%2522first_name%2522%253A%2522DeHopen%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522Dehopen%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252F1cxjHUxLtwio6PU0JD6u5txQhDUSCkufw8fUw9vOrZc.svg%2522%257D%26auth_date%3D1739808435%26signature%3DelBqutmHu0ehe3RR1_OBG2Z_sojd8NChAcLpdP_rnQ38ivT8QrBjtxsRyozteRaYB2_nulL9sYxaEMvFJsiqBA%26hash%3Dd099ffd45e27503ff67b3a88c5db16c4a9b7900a4fa78763cd8557cae5f8f899&tgWebAppVersion=8.0&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22destructive_text_color%22%3A%22%23ff453a%22%2C%22section_header_text_color%22%3A%22%23e5e5e5%22%2C%22bottom_bar_bg_color%22%3A%22%233e464c%22%2C%22secondary_bg_color%22%3A%22%231c1c1c%22%2C%22section_bg_color%22%3A%22%23282828%22%2C%22section_separator_color%22%3A%22%233d3d3d%22%2C%22bg_color%22%3A%22%23282828%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22header_bg_color%22%3A%22%231c1c1c%22%2C%22link_color%22%3A%22%23007aff%22%2C%22accent_text_color%22%3A%22%23007aff%22%2C%22subtitle_text_color%22%3A%22%23ffffff%22%2C%22button_color%22%3A%22%23007aff%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23ffffff%22%7D'

      // Виктор
       const init_data = 'query_id%3DAAExhbpYAAAAADGFuljbD2pF%26user%3D%257B%2522id%2522%253A1488618801%252C%2522first_name%2522%253A%2522Viktor%2522%252C%2522last_name%2522%253A%2522St%2522%252C%2522username%2522%253A%2522STR_Viktor%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252Fyt_vHT436Zb5sbv-Pui-oE8AJ9OcsFTJ2CotbwzNVoI.svg%2522%257D%26auth_date%3D1740844692%26signature%3DlLFQG-WzHS7naTmvuvTndO--qR3sbNNcTpFpQy2Dbq9yQQdPiiUVO25JPpZjaI5mEhCP8ASKd6Txk2swr99tAw%26hash%3Dc0039b00889db04e9415a5fead01b90b59fc0c4a8c4240a207639aa1c8e7f722&tgWebAppVersion=7.10&tgWebAppPlatform=web&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23212121%22%2C%22button_color%22%3A%22%238774e1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23aaaaaa%22%2C%22link_color%22%3A%22%238774e1%22%2C%22secondary_bg_color%22%3A%22%23181818%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22header_bg_color%22%3A%22%23212121%22%2C%22accent_text_color%22%3A%22%238774e1%22%2C%22section_bg_color%22%3A%22%23212121%22%2C%22section_header_text_color%22%3A%22%238774e1%22%2C%22subtitle_text_color%22%3A%22%23aaaaaa%22%2C%22destructive_text_color%22%3A%22%23ff595a%22%7D'

      // Тимур
      //const init_data = 'user%3D%257B%2522id%2522%253A563486774%252C%2522first_name%2522%253A%2522%25D0%25A2%25D0%25B8%25D0%25BC%25D1%2583%25D1%2580%2522%252C%2522last_name%2522%253A%2522%25D0%2596%25D0%25B5%25D0%25BA%25D1%2581%25D0%25B8%25D0%25BC%25D0%25B1%25D0%25B0%25D0%25B5%25D0%25B2%2522%252C%2522username%2522%253A%2522masterhorny1%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FC4XeN2yVR3QUy5Z20iFDDsgKdzUZi5SKp6u7yycVvJc.svg%2522%257D%26chat_instance%3D-5595947293846570514%26chat_type%3Dprivate%26auth_date%3D1740849503%26signature%3DPDZm27RrbMqCs60c1-nJzSyR_0UpHdPrbxvDclxjMpcxmsb7GZ9g0HXr2T-NkLns2p0ZCwhJAKurFHYaEhUmDg%26hash%3Df1b568c502ceea60866c7517d79d464e2c4fe4fa5898176da223cc2a042054b3&tgWebAppVersion=8.0&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22section_separator_color%22%3A%22%23213040%22%2C%22hint_color%22%3A%22%23b1c3d5%22%2C%22section_header_text_color%22%3A%22%23b1c3d5%22%2C%22destructive_text_color%22%3A%22%23ef5b5b%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22bottom_bar_bg_color%22%3A%22%23213040%22%2C%22bg_color%22%3A%22%2318222d%22%2C%22subtitle_text_color%22%3A%22%23b1c3d5%22%2C%22secondary_bg_color%22%3A%22%23131415%22%2C%22header_bg_color%22%3A%22%23131415%22%2C%22accent_text_color%22%3A%22%232ea6ff%22%2C%22button_color%22%3A%22%232ea6ff%22%2C%22section_bg_color%22%3A%22%2318222d%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22link_color%22%3A%22%2362bcf9%22%7D'

      // const init_data = `query_id%3DAAHa-fEBAwAAANr58QGsJmsJ%26user%3D%257B%2522id%2522%253A6475086298%252C%2522first_name%2522%253A%2522%25D0%2590%25D0%25BD%25D0%25B4%25D1%2580%25D0%25B5%25D0%25B9%2522%252C%2522last_name%2522%253A%2522%25D0%2593%25D0%25B5%25D1%2580%25D0%25B0%25D1%2581%25D0%25B8%25D0%25BC%25D0%25BE%25D0%25B2%2522%252C%2522username%2522%253A%2522De_Geras%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FGzJ9TEsOx7Oc1JJcHr-lzeFQB6alew8O_qoBdhO-6gGt7kZEiGJ6urTqgGlF9_Ye.svg%2522%257D%26auth_date%3D1740750454%26signature%3DwxvPQwu0hEbM3YIwQJaCRzxGcdywWYludL90wZksGq0ir7rg45O6RuZ2TwbXhZJjzy3yp6SS0CqG_iANhUfUCg%26hash%3Da25e34147c2ed695b20bf257c4fc734c52613f42a7ea8be3f6d96395b7bb6d7e&tgWebAppVersion=8.0&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22button_text_color%22%3A%22%23ffffff%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22subtitle_text_color%22%3A%22%23ffffff%22%2C%22bottom_bar_bg_color%22%3A%22%233e464c%22%2C%22section_header_text_color%22%3A%22%23e5e5e5%22%2C%22section_separator_color%22%3A%22%233d3d3d%22%2C%22bg_color%22%3A%22%23282828%22%2C%22header_bg_color%22%3A%22%231c1c1c%22%2C%22accent_text_color%22%3A%22%23007aff%22%2C%22section_bg_color%22%3A%22%23282828%22%2C%22button_color%22%3A%22%23007aff%22%2C%22link_color%22%3A%22%23007aff%22%2C%22hint_color%22%3A%22%23ffffff%22%2C%22destructive_text_color%22%3A%22%23ff453a%22%2C%22secondary_bg_color%22%3A%22%231c1c1c%22%7D`
      // const init_data = `query_id%3DAAHa-fEBAwAAANr58QFFg6SM%26user%3D%257B%2522id%2522%253A6475086298%252C%2522first_name%2522%253A%2522%25D0%2590%25D0%25BD%25D0%25B4%25D1%2580%25D0%25B5%25D0%25B9%2522%252C%2522last_name%2522%253A%2522%25D0%2593%25D0%25B5%25D1%2580%25D0%25B0%25D1%2581%25D0%25B8%25D0%25BC%25D0%25BE%25D0%25B2%2522%252C%2522username%2522%253A%2522De_Geras%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FGzJ9TEsOx7Oc1JJcHr-lzeFQB6alew8O_qoBdhO-6gGt7kZEiGJ6urTqgGlF9_Ye.svg%2522%257D%26auth_date%3D1739263999%26signature%3D6Nc44J8mpAyftuBwiEXHF3YyBtkbAptwj1YO0P99Dhmkpy1G1Nw8wxfR48B22hnqfGPnxxrf9vcSenT5ylpACg%26hash%3D90880b7f94adbd34cac6cd5d023fc5822c26b6d3036709f5dd60f547d2889a2c&tgWebAppVersion=7.2&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22button_text_color%22%3A%22%23ffffff%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22link_color%22%3A%22%23007aff%22%2C%22section_header_text_color%22%3A%22%23e5e5e5%22%2C%22button_color%22%3A%22%23007aff%22%2C%22subtitle_text_color%22%3A%22%23ffffff%22%2C%22bg_color%22%3A%22%23282828%22%2C%22accent_text_color%22%3A%22%23007aff%22%2C%22secondary_bg_color%22%3A%22%231c1c1c%22%2C%22destructive_text_color%22%3A%22%23ff453a%22%2C%22header_bg_color%22%3A%22%231c1c1c%22%2C%22section_bg_color%22%3A%22%23282828%22%2C%22hint_color%22%3A%22%23ffffff%22%7D`;
      // const init_data = 'query_id%3DAAFmCZpNAAAAAGYJmk2lHf3U%26user%3D%257B%2522id%2522%253A1301940582%252C%2522first_name%2522%253A%2522DeHopen%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522Dehopen%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252F1cxjHUxLtwio6PU0JD6u5txQhDUSCkufw8fUw9vOrZc.svg%2522%257D%26auth_date%3D1739808435%26signature%3DelBqutmHu0ehe3RR1_OBG2Z_sojd8NChAcLpdP_rnQ38ivT8QrBjtxsRyozteRaYB2_nulL9sYxaEMvFJsiqBA%26hash%3Dd099ffd45e27503ff67b3a88c5db16c4a9b7900a4fa78763cd8557cae5f8f899&tgWebAppVersion=8.0&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22destructive_text_color%22%3A%22%23ff453a%22%2C%22section_header_text_color%22%3A%22%23e5e5e5%22%2C%22bottom_bar_bg_color%22%3A%22%233e464c%22%2C%22secondary_bg_color%22%3A%22%231c1c1c%22%2C%22section_bg_color%22%3A%22%23282828%22%2C%22section_separator_color%22%3A%22%233d3d3d%22%2C%22bg_color%22%3A%22%23282828%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22header_bg_color%22%3A%22%231c1c1c%22%2C%22link_color%22%3A%22%23007aff%22%2C%22accent_text_color%22%3A%22%23007aff%22%2C%22subtitle_text_color%22%3A%22%23ffffff%22%2C%22button_color%22%3A%22%23007aff%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23ffffff%22%7D'
      // const init_data = 'query_id=AAEJqZMZAAAAAAmpkxme6jSA&user=%7B%22id%22%3A429107465%2C%22first_name%22%3A%22Kiryl%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22UseNameKiryl%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FRBi5fqzvkaFYBv7fi7y6iDpojRJtZPm9dHKm_PjZ-5U.svg%22%7D&auth_date=1739359084&signature=9qlTaVZXAb3xGsg238igZKrhr205XifTQvuhh1Fab0M_yXY5jgyQK55ORVCIXnj04ldTsm4GUyhh1fMfY2YyCA&hash=deeb159e958d25a03b671bd3e90afafc834fe15f2f51238c6b5a9c25ada04791'
      // const init_data = `user=%7B%22id%22%3A6547551264%2C%22first_name%22%3A%22Marketer%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Marketer7%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FZXmZsLRfqSwjww-KJ6vKAk7MdaJgauVvTBeAA_9wyR69odwqAQOCVE4Lm46UHmKn.svg%22%7D&chat_instance=4040856596542184382&chat_type=sender&auth_date=1739961223&signature=tbB5zrbfTz_e4Tk_4m5sJ22NIP8xypK7QgzRxSZFmA5IHUBC6o81Z3GgSbreA958_DALVFYX02-KPXI3D5BoCw&hash=38c5fc18ed5a08db81194555a775bd92591e78ac82539840b4665cf8e6abfb6d`
      // const init_data = 'query_id%3DAAHa-fEBAwAAANr58QFFg6SM%26user%3D%257B%2522id%2522%253A6475086298%252C%2522first_name%2522%253A%2522%25D0%2590%25D0%25BD%25D0%25B4%25D1%2580%25D0%25B5%25D0%25B9%2522%252C%2522last_name%2522%253A%2522%25D0%2593%25D0%25B5%25D1%2580%25D0%25B0%25D1%2581%25D0%25B8%25D0%25BC%25D0%25BE%25D0%25B2%2522%252C%2522username%2522%253A%2522De_Geras%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FGzJ9TEsOx7Oc1JJcHr-lzeFQB6alew8O_qoBdhO-6gGt7kZEiGJ6urTqgGlF9_Ye.svg%2522%257D%26auth_date%3D1739263999%26signature%3D6Nc44J8mpAyftuBwiEXHF3YyBtkbAptwj1YO0P99Dhmkpy1G1Nw8wxfR48B22hnqfGPnxxrf9vcSenT5ylpACg%26hash%3D90880b7f94adbd34cac6cd5d023fc5822c26b6d3036709f5dd60f547d2889a2c&tgWebAppVersion=7.2&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22button_text_color%22%3A%22%23ffffff%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22link_color%22%3A%22%23007aff%22%2C%22section_header_text_color%22%3A%22%23e5e5e5%22%2C%22button_color%22%3A%22%23007aff%22%2C%22subtitle_text_color%22%3A%22%23ffffff%22%2C%22bg_color%22%3A%22%23282828%22%2C%22accent_text_color%22%3A%22%23007aff%22%2C%22secondary_bg_color%22%3A%22%231c1c1c%22%2C%22destructive_text_color%22%3A%22%23ff453a%22%2C%22header_bg_color%22%3A%22%231c1c1c%22%2C%22section_bg_color%22%3A%22%23282828%22%2C%22hint_color%22%3A%22%23ffffff%22%7D'
      // const init_data = 'query_id=AAEJqZMZAAAAAAmpkxme6jSA&user=%7B%22id%22%3A429107465%2C%22first_name%22%3A%22Kiryl%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22UseNameKiryl%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FRBi5fqzvkaFYBv7fi7y6iDpojRJtZPm9dHKm_PjZ-5U.svg%22%7D&auth_date=1739359084&signature=9qlTaVZXAb3xGsg238igZKrhr205XifTQvuhh1Fab0M_yXY5jgyQK55ORVCIXnj04ldTsm4GUyhh1fMfY2YyCA&hash=deeb159e958d25a03b671bd3e90afafc834fe15f2f51238c6b5a9c25ada04791'
      //const init_data = 'query_id=AAEJqZMZAAAAAAmpkxme6jSA&user=%7B%22id%22%3A429107465%2C%22first_name%22%3A%22Kiryl%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22UseNameKiryl%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FRBi5fqzvkaFYBv7fi7y6iDpojRJtZPm9dHKm_PjZ-5U.svg%22%7D&auth_date=1739359084&signature=9qlTaVZXAb3xGsg238igZKrhr205XifTQvuhh1Fab0M_yXY5jgyQK55ORVCIXnj04ldTsm4GUyhh1fMfY2YyCA&hash=deeb159e958d25a03b671bd3e90afafc834fe15f2f51238c6b5a9c25ada04791'
      // const init_data = `user=%7B%22id%22%3A6547551264%2C%22first_name%22%3A%22Marketer%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Marketer7%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FZXmZsLRfqSwjww-KJ6vKAk7MdaJgauVvTBeAA_9wyR69odwqAQOCVE4Lm46UHmKn.svg%22%7D&chat_instance=4040856596542184382&chat_type=sender&auth_date=1739961223&signature=tbB5zrbfTz_e4Tk_4m5sJ22NIP8xypK7QgzRxSZFmA5IHUBC6o81Z3GgSbreA958_DALVFYX02-KPXI3D5BoCw&hash=38c5fc18ed5a08db81194555a775bd92591e78ac82539840b4665cf8e6abfb6d`
      // const init_data = 'query_id%3DAAHa-fEBAwAAANr58QFFg6SM%26user%3D%257B%2522id%2522%253A6475086298%252C%2522first_name%2522%253A%2522%25D0%2590%25D0%25BD%25D0%25B4%25D1%2580%25D0%25B5%25D0%25B9%2522%252C%2522last_name%2522%253A%2522%25D0%2593%25D0%25B5%25D1%2580%25D0%25B0%25D1%2581%25D0%25B8%25D0%25BC%25D0%25BE%25D0%25B2%2522%252C%2522username%2522%253A%2522De_Geras%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FGzJ9TEsOx7Oc1JJcHr-lzeFQB6alew8O_qoBdhO-6gGt7kZEiGJ6urTqgGlF9_Ye.svg%2522%257D%26auth_date%3D1739263999%26signature%3D6Nc44J8mpAyftuBwiEXHF3YyBtkbAptwj1YO0P99Dhmkpy1G1Nw8wxfR48B22hnqfGPnxxrf9vcSenT5ylpACg%26hash%3D90880b7f94adbd34cac6cd5d023fc5822c26b6d3036709f5dd60f547d2889a2c&tgWebAppVersion=7.2&tgWebAppPlatform=macos&tgWebAppThemeParams=%7B%22button_text_color%22%3A%22%23ffffff%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22link_color%22%3A%22%23007aff%22%2C%22section_header_text_color%22%3A%22%23e5e5e5%22%2C%22button_color%22%3A%22%23007aff%22%2C%22subtitle_text_color%22%3A%22%23ffffff%22%2C%22bg_color%22%3A%22%23282828%22%2C%22accent_text_color%22%3A%22%23007aff%22%2C%22secondary_bg_color%22%3A%22%231c1c1c%22%2C%22destructive_text_color%22%3A%22%23ff453a%22%2C%22header_bg_color%22%3A%22%231c1c1c%22%2C%22section_bg_color%22%3A%22%23282828%22%2C%22hint_color%22%3A%22%23ffffff%22%7D'

      // получаем телеграм айди из init_data, оно нужно в EnterInviteCodePage
      if (init_data.startsWith("query_id") || init_data.startsWith("user")) {
        setCurrentUserTelegramId(Number(extractTelegramIdFromInitData(init_data)));
      }

      const authResponse = await signIn({
        init_data,
      }).unwrap();

      // Store the tokens in localStorage
      localStorage.setItem('access_token', authResponse.access_token);
      localStorage.setItem('refresh_token', authResponse.refresh_token);


      return true;
    } catch (err) {
      console.error('Authentication error:', err);
      return false;
    }
  };

  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    await i18n.changeLanguage(language);
  };

  const handleLanguageContinue = () => {
    saveCurrentStep('invite_code');
  };

  const handleInviteCodeContinue = async () => {
    // Now that we have a valid invite code, we can proceed with authentication
    saveCurrentStep('signin');

    const success = await performAuthentication();
    if (success) {
      saveCurrentStep('skin');
    } else {
      // If authentication fails, go back to invite code page
      saveCurrentStep('invite_code');
    }
  };

  const handleSkinContinue = () => {
    saveCurrentStep('push');
    openModal(MODALS.DAYS_IN_A_ROW)
  };

  const handleModalClose = () => {
    localStorage.setItem('hasCompletedSetup', 'true');
    localStorage.removeItem('currentSetupStep');
    closeModal(MODALS.DAYS_IN_A_ROW);

    saveCurrentStep('completed');
  };


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
          // Это расскоментить для билда
          // referral_id={window.Telegram.WebApp.initData.user.id}
          referral_id={currentUserTelegramId ?? 0}
        />
      );

    case 'signin':
      return <LoadingScreen isAuthComplete={!isLoading && loadingStarted} onAnimationComplete={() => setIsAnimationFinished(true)} />; // Show loading during sign-in process

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