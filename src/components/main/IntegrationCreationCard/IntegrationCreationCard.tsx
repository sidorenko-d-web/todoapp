import { FC, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dotIcon from '../../../assets/icons/dot.svg';
import rocketIcon from '../../../assets/icons/rocket.svg';
import { IntegrationResponseDTO, integrationsApi, RootState, selectVolume, setIsWorking } from '../../../redux';
import s from './IntegrationCreationCard.module.scss';
import { useAccelerateIntegration } from '../../../hooks';
import { GUIDE_ITEMS, SOUNDS } from '../../../constants';
import { isGuideShown, setGuideShown } from '../../../utils';
import { setIntegrationReadyForPublishing, setLastIntegrationId } from '../../../redux/slices/guideSlice';
import useSound from 'use-sound';
import { TrackedButton } from '../..';
import { useTranslation } from 'react-i18next';
import { setIntegrationCreating } from '../../../redux/slices/integrationAcceleration';

interface CreatingIntegrationCardProps {
  integration: IntegrationResponseDTO;
  refetchIntegration?: () => void;
}

const TIME_LEFT_KEY = 'integration_time_left';
const INITIAL_TIME_LEFT_KEY = 'integration_initial_time_left';
const INTEGRATION_ID_KEY = 'integration_id';
const LAST_UPDATED_TIME_KEY = 'last_updated_time';

export const IntegrationCreationCard: FC<CreatingIntegrationCardProps> = ({ integration }) => {
  const { t } = useTranslation('integrations');
  const dispatch = useDispatch();
  const [hasBorder, setHasBorder] = useState(false);

  const getSavedTimeLeft = () => {
    const savedIntegrationId = localStorage.getItem(INTEGRATION_ID_KEY);
    const savedTimeLeft = localStorage.getItem(TIME_LEFT_KEY);
    const lastUpdatedTime = localStorage.getItem(LAST_UPDATED_TIME_KEY);

    if (savedIntegrationId === integration.id && savedTimeLeft && lastUpdatedTime) {
      const currentTime = Math.floor(Date.now() / 1000);
      const elapsedTime = currentTime - parseInt(lastUpdatedTime);
      const newTimeLeft = Math.max(parseInt(savedTimeLeft) - elapsedTime, 0);
      return newTimeLeft;
    }
    return 300;
  };

  const getSavedInitialTimeLeft = () => {
    const savedIntegrationId = localStorage.getItem(INTEGRATION_ID_KEY);
    const savedInitialTimeLeft = localStorage.getItem(INITIAL_TIME_LEFT_KEY);

    if (savedIntegrationId === integration.id && savedInitialTimeLeft) {
      return parseInt(savedInitialTimeLeft);
    }
    return 300;
  };

  const [timeLeft, setTimeLeft] = useState(getSavedTimeLeft());
  const [initialTimeLeft] = useState(getSavedInitialTimeLeft());
  const [isExpired, setIsExpired] = useState(timeLeft <= 0);
  const [isAccelerated, setIsAccelerated] = useState(false);
  const [playAccelerateIntegrationSound] = useSound(SOUNDS.speedUp, { volume: useSelector(selectVolume) });

  const accelerationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { accelerateIntegration } = useAccelerateIntegration({
    integrationId: integration.id,
    onSuccess: newTimeLeft => {
      setTimeLeft(newTimeLeft);
      localStorage.setItem(TIME_LEFT_KEY, newTimeLeft.toString());
      localStorage.setItem(LAST_UPDATED_TIME_KEY, Math.floor(Date.now() / 1000).toString());
    },
  });

  useEffect(() => {
    localStorage.setItem(INTEGRATION_ID_KEY, integration.id);
    localStorage.setItem(INITIAL_TIME_LEFT_KEY, initialTimeLeft.toString());
    localStorage.setItem(LAST_UPDATED_TIME_KEY, Math.floor(Date.now() / 1000).toString());
  }, [integration.id, initialTimeLeft]);

  useEffect(() => {
    dispatch(setIntegrationCreating(true));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem(TIME_LEFT_KEY, timeLeft.toString());
  }, [timeLeft]);

  const [acceleration, setAcceleration] = useState(0);
  const reduxAcceleration = useSelector((state: RootState) => state.acceleration.acceleration);

  useEffect(() => {
    if (acceleration !== reduxAcceleration) {
      handleAccelerateClick();
      setAcceleration(reduxAcceleration + 20);
    }
  }, [reduxAcceleration]);

  const calculateProgress = () => {
    return ((initialTimeLeft - timeLeft) / initialTimeLeft) * 100;
  };

  const accelerateGuideClosed = useSelector((state: RootState) => state.guide.accelerateIntegrationGuideClosed);

  const [progress, setProgress] = useState(calculateProgress());

  useEffect(() => {
    setProgress(calculateProgress());
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (accelerationTimeoutRef.current) {
        clearTimeout(accelerationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isExpired) void accelerateIntegration(3600);
      setIsExpired(true);
      dispatch(integrationsApi.util.invalidateTags(['Integrations']));
    }
  }, [timeLeft, accelerateIntegration, isExpired, dispatch]);

  // useEffect(() => {
  //   if (!isGuideShown(GUIDE_ITEMS.creatingIntegration.INITIAL_INTEGRATION_DURATION_SET)) {
  //     accelerateIntegration(timeLeft - 20);
  //     setGuideShown(GUIDE_ITEMS.creatingIntegration.INITIAL_INTEGRATION_DURATION_SET);
  //   }
  // }, [accelerateIntegration, timeLeft]);

  useEffect(() => {
    dispatch(setIsWorking(true));
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = Math.max(prevTime - 1, 0);
        localStorage.setItem(TIME_LEFT_KEY, newTime.toString());
        localStorage.setItem(LAST_UPDATED_TIME_KEY, Math.floor(Date.now() / 1000).toString());
        return newTime;
      });
    }, 1000);

    if (isExpired) {
      console.log('INTEGRATION EXPIRED!!!');
      dispatch(setIntegrationCreating(false));
      dispatch(setIsWorking(false));
      clearInterval(timerId);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [isExpired, dispatch]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleAccelerateClick = () => {
    if (!isExpired) {
      playAccelerateIntegrationSound();
      dispatch(setLastIntegrationId(integration.id));
      void accelerateIntegration(1);
      createParticles();
      setHasBorder(true);

      if (accelerationTimeoutRef.current) {
        clearTimeout(accelerationTimeoutRef.current);
      }

      if (!isAccelerated) {
        setIsAccelerated(true);
      }

      accelerationTimeoutRef.current = setTimeout(() => {
        setIsAccelerated(false);
        setHasBorder(false);
        accelerationTimeoutRef.current = null;
      }, 2000);

      // Обновляем данные о текущей интеграции
      //refetchIntegration();
    }
  };

  const createParticles = () => {
    const button = document.querySelector(`.${s.iconButton}`);
    const progressBar = document.querySelector(`.${s.progressBar}`);

    if (!button || !progressBar) return;

    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.classList.add(s.particle);
      button.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 800);
    }
  };

  if (isExpired) {
    dispatch(setIntegrationReadyForPublishing(true));
    dispatch(setLastIntegrationId(integration.id));
    dispatch(setIntegrationCreating(false));
    if (!isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED)) {
      setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED);
    }
    return null;
  }

  return (
    <div
      className={`${s.integration} ${isAccelerated ? s.accelerated : ''}
       ${
         accelerateGuideClosed && !isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN)
           ? s.bordered
           : ''
       }`}
    >
      <div className={s.integrationHeader}>
        <h2 className={s.title}>{t('i10')}</h2>
        <span className={s.author}>
          {integration.campaign.company_name} <img src={dotIcon} height={14} width={14} alt="dot" />
        </span>
      </div>
      <div className={s.body}>
        <div className={s.info}>
          <div className={s.infoHeader}>
            <span>{t('i11')}...</span>
            <span>
              {t('i12')} {formatTime(timeLeft)}
            </span>
          </div>
          <div className={s.progressBar} style={{ border: hasBorder ? '1px solid #2064C0' : 'none' }}>
            <div className={s.progressBarInner} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <TrackedButton
          trackingData={{
            eventType: 'button',
            eventPlace: `Ускорить создание интеграции - Главный экран`,
          }}
          className={s.iconButton}
          onClick={handleAccelerateClick}
          disabled={false}
          aria-label={t('i24')}
        >
          <img src={rocketIcon} alt="rocket" />
        </TrackedButton>
      </div>
    </div>
  );
};
