import { FC, useEffect } from 'react';
import rocketIcon from '../../../assets/icons/rocket.svg';
import s from './LoadingScreenBar.module.scss';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared';

const INITIAL_DURATION = 1500;
const UPDATE_INTERVAL = 25;

interface LoadingScreenBarProps {
    speedMultiplier: number;
    progress: number;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
}

export const LoadingScreenBar: FC<LoadingScreenBarProps> = ({ speedMultiplier, progress, setProgress }) => {
    const { t } = useTranslation('integrations');

    useEffect(() => {
        if (progress >= 100) return;

        const progressIncrement = (100 / (INITIAL_DURATION / UPDATE_INTERVAL)) * speedMultiplier;

        const timerId = setInterval(() => {
            setProgress(prev => Math.min(prev + progressIncrement, 100));
        }, UPDATE_INTERVAL);

        return () => clearInterval(timerId);
    }, [speedMultiplier, progress]);

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
