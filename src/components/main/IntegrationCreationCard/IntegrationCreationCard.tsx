import { FC, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dotIcon from '../../../assets/icons/dot.svg';
import rocketIcon from '../../../assets/icons/rocket.svg';
import { IntegrationResponseDTO, integrationsApi, RootState, selectVolume, setIsWorking } from '../../../redux';
import s from './IntegrationCreationCard.module.scss';
import { useAccelerateIntegration, useModal } from '../../../hooks';
import { MODALS, SOUNDS } from '../../../constants';
import { setIntegrationReadyForPublishing, setLastIntegrationId } from '../../../redux';
import useSound from 'use-sound';
import { TrackedButton } from '../..';
import { useTranslation } from 'react-i18next';
import { setIntegrationCreating } from '../../../redux/slices/integrationAcceleration';

interface CreatingIntegrationCardProps {
  integration: IntegrationResponseDTO;
  refetchIntegration: () => void;
}

const TIME_LEFT_KEY = 'integration_time_left';
const INITIAL_TIME_LEFT_KEY = 'integration_initial_time_left';
const INTEGRATION_ID_KEY = 'integration_id';

export const IntegrationCreationCard: FC<CreatingIntegrationCardProps> = ({ integration, refetchIntegration }) => {
  const { t } = useTranslation('integrations');
  const dispatch = useDispatch();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const accelerationRef = useRef(false);
  const lastUpdateRef = useRef(Date.now());

  const reduxAcceleration = useSelector((state: RootState) => state.acceleration.acceleration);
  const [acceleration, setAcceleration] = useState(0);

  useEffect(() => {
    if (acceleration != reduxAcceleration) {
      handleAccelerateClick();
      setAcceleration(reduxAcceleration);
    }
  }, [reduxAcceleration]);

  const getValidatedTimeLeft = useCallback(() => {
    const savedIntegrationId = localStorage.getItem(INTEGRATION_ID_KEY);
    const savedTimeLeft = localStorage.getItem(TIME_LEFT_KEY);
    const savedInitialTimeLeft = localStorage.getItem(INITIAL_TIME_LEFT_KEY);

    if (savedIntegrationId === integration.id && savedTimeLeft && savedInitialTimeLeft) {
      const initial = parseInt(savedInitialTimeLeft);
      const current = parseInt(savedTimeLeft);

      return Math.min(current, initial);
    }
    return integration.time_left;
  }, [integration.id, integration.time_left]);

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = getValidatedTimeLeft();
    return Math.max(savedTime, 0);
  });

  const [initialTimeLeft] = useState(() => {
    const savedInitial = localStorage.getItem(INITIAL_TIME_LEFT_KEY);
    return savedInitial ? parseInt(savedInitial) : integration.time_left;
  });

  const [isExpired, setIsExpired] = useState(timeLeft <= 0);
  const [isAccelerated, setIsAccelerated] = useState(false);
  const [playAccelerateIntegrationSound] = useSound(SOUNDS.speedUp, {
    volume: useSelector(selectVolume),
  });

  const { accelerateIntegration } = useAccelerateIntegration({
    integrationId: integration.id,
    onSuccess: () => {
      const newTimeLeft = integration.time_left;
      setTimeLeft(newTimeLeft);
      localStorage.setItem(TIME_LEFT_KEY, newTimeLeft.toString());
    },
  });

  const progress = useMemo(() => {
    return ((initialTimeLeft - timeLeft) / initialTimeLeft) * 100;
  }, [initialTimeLeft, timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${secs < 10 ? `0${secs}` : secs}`;
  }, []);

  const formattedTime = useMemo(() => formatTime(timeLeft), [formatTime, timeLeft]);

  useEffect(() => {
    setTimeLeft(integration.time_left);
  }, []);

  useEffect(() => {
    localStorage.setItem(INTEGRATION_ID_KEY, integration.id);
    localStorage.setItem(INITIAL_TIME_LEFT_KEY, initialTimeLeft.toString());
    localStorage.setItem(TIME_LEFT_KEY, timeLeft.toString());

    dispatch(setIntegrationCreating(true));
    dispatch(setIsWorking(true));

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.floor((now - lastUpdateRef.current) / 1000);

      if (diff > 0) {
        lastUpdateRef.current = now;
        setTimeLeft(prev => {
          const newTime = Math.max(prev - diff, 0);
          localStorage.setItem(TIME_LEFT_KEY, newTime.toString());
          return newTime;
        });
      }
    };

    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      dispatch(setIntegrationCreating(false));
      dispatch(setIsWorking(false));
    };
  }, [integration.id, initialTimeLeft, dispatch]);

  const { closeModal } = useModal();
  useEffect(() => {
    closeModal(MODALS.CREATING_INTEGRATION);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && !isExpired) {
      setIsExpired(true);
      void accelerateIntegration(3600).finally(() => {
        dispatch(integrationsApi.util.invalidateTags(['Integrations']));
      });
    }
  }, [timeLeft, isExpired, accelerateIntegration, dispatch]);

  // useEffect(() => {
  //   if (!isGuideShown(GUIDE_ITEMS.creatingIntegration.INITIAL_INTEGRATION_DURATION_SET)) {
  //     accelerateIntegration(timeLeft - 20);
  //     setGuideShown(GUIDE_ITEMS.creatingIntegration.INITIAL_INTEGRATION_DURATION_SET);
  //   }
  // }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const savedTime = getValidatedTimeLeft();
        const timePassed = Math.floor((Date.now() - lastUpdateRef.current) / 1000);
        const correctedTime = Math.max(savedTime - timePassed, 0);

        setTimeLeft(correctedTime);
        localStorage.setItem(TIME_LEFT_KEY, correctedTime.toString());
        lastUpdateRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleAccelerateClick = useCallback(() => {
    if (isExpired) return;

    accelerationRef.current = true;
    playAccelerateIntegrationSound();
    dispatch(setLastIntegrationId(integration.id));

    void accelerateIntegration(1).finally(() => {
      refetchIntegration();
    });

    setIsAccelerated(true);
    createParticles();

    const timeoutId = setTimeout(() => {
      setIsAccelerated(false);
      accelerationRef.current = false;
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [isExpired, playAccelerateIntegrationSound, dispatch, integration.id, accelerateIntegration, refetchIntegration]);

  const createParticles = useCallback(() => {
    const button = document.querySelector(`.${s.iconButton}`);
    if (!button) return;

    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.classList.add(s.particle);
      button.appendChild(particle);

      setTimeout(() => particle.remove(), 800);
    }
  }, []);

  if (timeLeft <= 0) {
    dispatch(setIntegrationReadyForPublishing(true));
    dispatch(setLastIntegrationId(integration.id));
    return null;
  }

  return (
    <div className={`${s.integration} ${s.elevated} ${isAccelerated ? s.accelerated : ''}`}>
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
              {t('i12')} {formattedTime}
            </span>
          </div>
          <div className={s.progressBar}>
            <div className={s.progressBarInner} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <TrackedButton
          trackingData={{
            eventType: 'button',
            eventPlace: 'Ускорить создание интеграции - Главный экран',
          }}
          className={s.iconButton}
          onClick={handleAccelerateClick}
          disabled={isExpired}
          aria-label={t('i24')}
        >
          <img src={rocketIcon} alt="rocket" />
        </TrackedButton>
      </div>
    </div>
  );
};
