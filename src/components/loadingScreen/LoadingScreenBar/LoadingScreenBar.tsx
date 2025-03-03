import { FC, useEffect, useState } from 'react';
import rocketIcon from '../../../assets/icons/rocket.svg';
import s from './LoadingScreenBar.module.scss';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared';

const INITIAL_DURATION = 1500;
const MIN_DISPLAY_TIME = 1000; 
const UPDATE_INTERVAL = 25;

interface LoadingScreenBarProps {
    speedMultiplier: number;
    progress: number;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
}

export const LoadingScreenBar: FC<LoadingScreenBarProps> = ({ speedMultiplier, progress, setProgress }) => {
    const { t } = useTranslation('integrations');
    const [minTimePassed, setMinTimePassed] = useState(false);

    // Ensure the loading bar is visible for at least 2 seconds
    useEffect(() => {
        const minTimeTimeout = setTimeout(() => {
            setMinTimePassed(true);
        }, MIN_DISPLAY_TIME);

        return () => clearTimeout(minTimeTimeout);
    }, []);

    useEffect(() => {
        if (progress >= 100) return;

        const progressIncrement = (100 / (INITIAL_DURATION / UPDATE_INTERVAL)) * speedMultiplier;

        const timerId = setInterval(() => {
            setProgress(prev => {
                // Prevent progress from reaching 100% before 2 seconds
                if (!minTimePassed && prev + progressIncrement >= 100) {
                    return prev; // Stop at the current progress until time passes
                }
                return Math.min(prev + progressIncrement, 100);
            });
        }, UPDATE_INTERVAL);

        return () => clearInterval(timerId);
    }, [speedMultiplier, progress, minTimePassed]);

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
                            style={{
                                width: `${progress}%`,
                                transition: progress >= 100 ? 'width 0.1s linear' : 'width 0.05s linear',
                            }}
                        />
                    </div>
                </div>
                <Button className={s.iconButton} disabled={false} aria-label={t('i24')}>
                    <img src={rocketIcon} alt="rocket" />
                </Button>
            </div>
        </div>
    );
};
