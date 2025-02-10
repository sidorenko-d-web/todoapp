import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import dotIcon from '../../../assets/icons/dot.svg';
import rocketIcon from '../../../assets/icons/rocket.svg';
import { IntegrationResponseDTO, integrationsApi } from '../../../redux';
import s from './IntegrationCreationCard.module.scss';
import { useAccelerateIntegration } from '../../../hooks';
import { GUIDE_ITEMS } from '../../../constants';
import { isGuideShown, setGuideShown } from '../../../utils';
import { setIntegrationReadyForPublishing } from '../../../redux/slices/guideSlice';

interface CreatingIntegrationCardProps {
  integration: IntegrationResponseDTO;
}

export const IntegrationCreationCard: FC<CreatingIntegrationCardProps> = ({
  integration,
}) => {
 
  const dispatch = useDispatch();
  const initialTime = 3600;
  const [timeLeft, setTimeLeft] = useState(integration.time_left);
  const [isExpired, setIsExpired] = useState(false);

  const calculateProgress = () => ((initialTime - timeLeft) / initialTime) * 100;

  const { accelerateIntegration, isAccelerating } = useAccelerateIntegration({
    integrationId: integration.id,
    onSuccess: newTimeLeft => setTimeLeft(newTimeLeft),
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isExpired) void accelerateIntegration(3600);
      setIsExpired(true);
      dispatch(integrationsApi.util.invalidateTags(['Integrations']));
    }
  }, [timeLeft, accelerateIntegration]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => Math.max(prevTime - 1, 0));
    }, 1000);

    if (isExpired) {
      clearInterval(timerId);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [isExpired]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleAccelerateClick = () => {
    if (!isExpired) {
      console.log('expired? ' + isExpired);
      console.log('published btn clc ' + sessionStorage.getItem(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED));
      void accelerateIntegration(isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED) ? 1 : timeLeft-1);
      createParticles();
    }
  };

  const createParticles = () => {
    const button = document.querySelector(`.${s.iconButton}`);
    const progressBar = document.querySelector(`.${s.progressBar}`);

    if (!button || !progressBar) return;

    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.classList.add(s.particle);

      particle.style.left = `calc(100% - 10px)`;
      particle.style.top = `${button.clientHeight / 2}px`;

      button.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 800);
    }
  };

  if (isExpired) {
    console.log('EXPIRED');
    if(!isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED)) {
      setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED);
      dispatch(setIntegrationReadyForPublishing(true));
    }
    return null;
  };

  return (
    <div className={`${s.integration} ${s.elevated}`}>
      <div className={s.integrationHeader}>
        <h2 className={s.title}>Интеграция</h2>
        <span className={s.author}>
          {integration.campaign.company_name}{' '}
          <img src={dotIcon} height={14} width={14} alt="dot" />
        </span>
      </div>
      <div className={s.body}>
        <div className={s.info}>
          <div className={s.infoHeader}>
            <span>Создание интеграции...</span>
            <span>Осталось {formatTime(timeLeft)}</span>
          </div>
          <div className={s.progressBar}>
            <div
              className={s.progressBarInner}
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
        <button
          className={s.iconButton}
          onClick={handleAccelerateClick}
          disabled={isExpired || isAccelerating}
          aria-label="Ускорить интеграцию"
        >
          <img src={rocketIcon} alt="rocket" />
        </button>
      </div>
    </div>
  );
};
