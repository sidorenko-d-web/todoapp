import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import dotIcon from '../../../assets/icons/dot.svg';
import rocketIcon from '../../../assets/icons/rocket.svg';
import { IntegrationResponseDTO, integrationsApi } from '../../../redux';

import s from './IntegrationCreationCard.module.scss';

interface CreatingIntegrationCardProps {
  integration: IntegrationResponseDTO;
}

export const IntegrationCreationCard: FC<CreatingIntegrationCardProps> = ({ integration }) => {
  const initialTime = 3600;
  const [ timeLeft, setTimeLeft ] = useState(integration.time_left);
  const dispatch = useDispatch();

  const calculateProgress = () => ((initialTime - timeLeft) / initialTime) * 100;

  useEffect(() => {
    if (timeLeft <= 0) {
      dispatch(integrationsApi.util.invalidateTags([ 'Integrations' ]));
      return;
    }
  }, [ timeLeft, dispatch ]);

  useEffect(() => {
    console.log('creating interval');
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => {
      console.log('clear');
      clearInterval(timerId);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <div className={s.integration}>
      <div className={s.integrationHeader}>
        <h2 className={s.title}>Интеграция</h2>
        <span className={s.author}>
          {integration.campaign.company_name} <img src={dotIcon} height={14} width={14} alt="dot" />
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
        <button className={s.iconButton}>
          <img src={rocketIcon} alt="rocket" />
        </button>
      </div>
    </div>
  );
};
