import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import styles from './CountdownTimer.module.scss';
import timerAnimation from "../../assets/animations/timer.json"
import i18next from 'i18next';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const CountdownTimer = () => {
    const calculateTimeRemaining = (): TimeLeft => {
        const targetDate = new Date('2025-03-18T12:00:00+03:00');
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();
        
        // If date has passed
        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        
        // Calculate time units
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        return { days, hours, minutes, seconds };
    };
    
    // Initialize state with calculated values
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeRemaining());

    // Set the target date to March 18, 2025 at 12:00 AM
    useEffect(() => {
        // Update immediately once to ensure correct values
        setTimeLeft(calculateTimeRemaining());
        
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeRemaining());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Format the time with leading zeros
    const formatTime = (time: number) => {
        return String(time).padStart(2, '0');
    };

    const timerDisplay = `${formatTime(timeLeft.days)}:${formatTime(timeLeft.hours)}:${formatTime(timeLeft.minutes)}:${formatTime(timeLeft.seconds)}`;

    return (
        <div className={styles.countdownContainer}>
            <section className={styles.mainContent}>
                <Lottie
                    animationData={timerAnimation}
                    className={styles.lottiePlayer}
                    loop={true}
                    autoplay={true}
                />

                <div className={styles.timerDisplay}>{timerDisplay}</div>
            </section>

            <section className={styles.text}>
                <div className={styles.messageText}>
                    {i18next.language === 'ru' ? "🔒 Приложение уже доступно для Android. Ожидайте запуск на iOS!" : "🔒 The app is already available for Android. Stay tuned for the launch on iOS!"}
                </div>
            </section>
        </div>
    );
};

export default CountdownTimer;