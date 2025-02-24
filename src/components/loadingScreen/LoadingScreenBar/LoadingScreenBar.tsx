import { FC, useEffect, useState } from 'react';
import rocketIcon from '../../../assets/icons/rocket.svg';
import s from './LoadingScreenBar.module.scss';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared';

const initialDuration = 5000;
const updateInterval = 50;

interface LoadingScreenBarProps {
    speedMultiplier: number;
}


export const LoadingScreenBar: FC<LoadingScreenBarProps> = ({ speedMultiplier }) => {
    const { t } = useTranslation('integrations');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const totalSteps = initialDuration / updateInterval;
        const progressIncrement = 100 / totalSteps;

        const timerId = setInterval(() => {
            setProgress(prev => Math.min(prev + progressIncrement * speedMultiplier, 100));
        }, updateInterval);

        return () => clearInterval(timerId);
    }, [speedMultiplier]);

    return (
        <div className={`${s.wrp} ${s.elevated}`}>
            <div className={s.integrationHeader}>
                <h2 className={s.title}>{t('i10')}</h2>
            </div>
            <div className={s.body}>
                <div className={s.info}>
                    <span className={s.loadingText}>{t('i3')}</span>
                    <div className={s.progressBar}>
                        <div
                            className={s.progressBarInner}
                            style={{ width: `${progress}%`, transition: 'width 0.05s linear' }}
                        />
                    </div>
                </div>
                <Button
                    className={s.iconButton}
                    disabled={false}
                    aria-label={t('i24')}
                >
                    <img src={rocketIcon} alt="rocket" />
                </Button>
            </div>
        </div>
    );
};
