import { FC, useEffect, useState } from 'react';
import rocketIcon from '../../../assets/icons/rocket.svg';
import s from './LoadingScreenBar.module.scss';

import { useTranslation } from 'react-i18next';

import { Button } from '../../shared';

import useSound from 'use-sound';
import { SOUNDS } from '../../../constants';
import { useSelector } from 'react-redux';
import { selectVolume } from '../../../redux';

const initialTime = 800;

export const LoadingScreenBar: FC<{ }> = () => {
    const { t } = useTranslation('integrations');
    const [timeLeft, setTimeLeft] = useState(initialTime);

    const [playAccelerateIntegrationSound] = useSound(SOUNDS.speedUp, { volume: useSelector(selectVolume) });

    const calculateProgress = () => ((initialTime - timeLeft) / initialTime) * 100;

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimeLeft(prevTime => {
                const newTime = Math.max(prevTime - 1, 0);
                
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    const createParticles = () => {
        const button = document.querySelector(`.${s.iconButton}`) as HTMLElement | null;
        
        if (!button) return;
    
        const rect = button.getBoundingClientRect(); // Get button's absolute position
        const parent = button.offsetParent as HTMLElement | null; // Ensure offsetParent exists
        const parentRect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 };
    
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.classList.add(s.particle);
    
            // Position relative to the button
            particle.style.left = `${rect.left - parentRect.left + rect.width / 2}px`;
            particle.style.top = `${rect.top - parentRect.top + rect.height / 2}px`;
    
            button.appendChild(particle);
    
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    };
    

    const handleAccelerateClick = () => {
        playAccelerateIntegrationSound();
        createParticles();
    };

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
                            style={{ width: `${calculateProgress()}%` }}
                        />
                    </div>
                </div>
                <Button
                    className={s.iconButton}
                    onClick={handleAccelerateClick}
                    disabled={false}
                    aria-label={t('i24')}
                >
                    <img src={rocketIcon} alt="rocket" />
                </Button>
            </div>
        </div>
    );
};
