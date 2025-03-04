import { useEffect, forwardRef, useImperativeHandle } from 'react';
import rocketIcon from '../../../assets/icons/rocket.svg';
import s from './LoadingScreenBar.module.scss';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared';

const INITIAL_DURATION = 5000;
const UPDATE_INTERVAL = 15;

interface LoadingScreenBarProps {
    speedMultiplier: number;
    progress: number;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    isAuthComplete: boolean;
}

export interface LoadingScreenBarRef {
    createParticles: () => void;
}

export const LoadingScreenBar = forwardRef<LoadingScreenBarRef, LoadingScreenBarProps>( 
    ({ speedMultiplier, progress, setProgress, isAuthComplete }, ref) => {
        const { t } = useTranslation('integrations');

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

        useImperativeHandle(ref, () => ({
            createParticles,
        }));

        useEffect(() => {
            if (progress >= 100) return;

            const baseIncrement = 100 / (INITIAL_DURATION / UPDATE_INTERVAL);
            const finalSpeed = isAuthComplete ? 5 : 1;
            const progressIncrement = baseIncrement * speedMultiplier * finalSpeed;

            const timerId = setInterval(() => {
                setProgress(prev => Math.min(prev + progressIncrement, 100));
            }, UPDATE_INTERVAL);

            return () => clearInterval(timerId);
        }, [speedMultiplier, progress, isAuthComplete]);

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
                    <Button 
                        className={`${s.iconButton} ${s.progressButton}`} 
                        disabled={false} 
                        aria-label={t('i24')}
                    >
                        <img src={rocketIcon} alt="rocket" />
                    </Button>
                </div>
            </div>
        );
    }
);