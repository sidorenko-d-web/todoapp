import { FC, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dotIcon from '../../../assets/icons/dot.svg';
import rocketIcon from '../../../assets/icons/rocket.svg';
import { integrationsApi, profileApi, RootState, selectVolume, setFirstIntegrationCreating, setIntegrationReadyForPublishing, setIsWorking, setLastIntegrationId, useCreateIntegrationMutation, useUpdateTimeLeftMutation } from '../../../redux';
import s from './GuideIntegrationCreationCard.module.scss';
import { GUIDE_ITEMS, SOUNDS } from '../../../constants';

import useSound from 'use-sound';
import { TrackedButton } from '../..';
import { isGuideShown, setGuideShown } from '../../../utils';


export const UserGuideCreationCard: FC = () => {
  const dispatch = useDispatch();
  const [hasBorder, setHasBorder] = useState(false);

  const [timeLeft, setTimeLeft] = useState(20);
  const [isExpired, setIsExpired] = useState(false);
  const [isAccelerated, setIsAccelerated] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playAccelerateSound] = useSound(SOUNDS.speedUp, { volume: useSelector(selectVolume) });

  const accelerationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [createIntegration] = useCreateIntegrationMutation();
  const [updateTimeLeft] = useUpdateTimeLeftMutation();

  const calculateProgress = () => ((20 - timeLeft) / 20) * 100;

  const [progress, setProgress] = useState(calculateProgress());

  const reduxAcceleration = useSelector((state: RootState) => state.acceleration.acceleration);
  const [acceleration, setAcceleration] = useState(0);

  useEffect(() => {
    if (acceleration != reduxAcceleration) {
      handleAccelerateClick();
      setAcceleration(reduxAcceleration + 20);
    }
  }, [reduxAcceleration]);

  useEffect(() => {
    setProgress(calculateProgress());
  }, [timeLeft]);

  useEffect(() => {
    dispatch(setIsWorking(true));

    const timerId = setInterval(() => {
      if (!isPaused) {
        setTimeLeft((prevTime) => {
          const newTime = Math.max(prevTime - 1, 0);
          if (newTime === 10) setIsPaused(true);
          if (newTime === 0) {
            dispatch(setIsWorking(false));
            clearInterval(timerId);

            if(!isGuideShown(GUIDE_ITEMS.creatingIntegration.FIRST_INTEGRATION_CREATED)) {
              createIntegration('909f329a-234f-4eca-87ab-0e29973cf8f3').unwrap().then((response) => {
                if (response.id) {
                  setGuideShown(GUIDE_ITEMS.creatingIntegration.FIRST_INTEGRATION_CREATED);
                  updateTimeLeft({ integrationId: response.id, timeLeftDelta: 36000 });
                  dispatch(setIntegrationReadyForPublishing(true));
                  dispatch(setLastIntegrationId(response.id));
                  dispatch(setFirstIntegrationCreating(false));
                  dispatch(integrationsApi.util.invalidateTags(['Integrations']));
                  dispatch(profileApi.util.invalidateTags(['Me']));
                  setIsExpired(true); 
                }
              });
              
            }
          }
          return newTime;
        });
      }
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [isExpired, isPaused, dispatch, createIntegration, updateTimeLeft]);

  const handleAccelerateClick = () => {
    if (!isExpired) {
      playAccelerateSound();
      setTimeLeft((prev) => Math.max(prev - 1, 0));
      createParticles();
      setHasBorder(true);

      if (accelerationTimeoutRef.current) {
        clearTimeout(accelerationTimeoutRef.current);
      }

      setIsAccelerated(true);
      setIsPaused(false);

      accelerationTimeoutRef.current = setTimeout(() => {
        setIsAccelerated(false);
        setHasBorder(false);
        accelerationTimeoutRef.current = null;
      }, 2000);
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  if (isExpired) {
    return null;
  }

  return (
    <div className={`${s.integration} ${isAccelerated ? s.accelerated : ''}`}>
      <div className={s.integrationHeader}>
        <h2 className={s.title}>"User Guide Creation"</h2>
        <span className={s.author}>
          "Guide System" <img src={dotIcon} height={14} width={14} alt="dot" />
        </span>
      </div>
      <div className={s.body}>
        <div className={s.info}>
          <div className={s.infoHeader}>
            <span>"Guide in Progress..."</span>
            <span>"Time left: " {formatTime(timeLeft)}</span>
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
          aria-label="Accelerate Guide"
        >
          <img src={rocketIcon} alt="rocket" />
        </TrackedButton>
      </div>
    </div>
  );
};
