import gearsAnimation from "../../assets/animations/gears.json";
import Lottie from 'lottie-react';
import styles from './TechWorkPage.module.scss';
import i18next from 'i18next';

const TechWorkPage = () => {
    return (
        <div className={styles.techWorkContainer}>
            <section className={styles.mainContent}>
                <Lottie
                    animationData={gearsAnimation}
                    className={styles.lottiePlayer}
                    loop={true}
                    autoplay={true}
                />
            </section>

            <section className={styles.text}>
                <div className={styles.primaryText}>
                    {i18next.language === 'ru' 
                        ? "🔧 Внимание! В боте ведутся технические работы. Как только всё будет готово, мы сразу сообщим! Спасибо за понимание."
                        : "🔧 Attention! The bot is undergoing technical maintenance. We will notify you as soon as everything is ready! Thank you for your understanding."}
                </div>
                <div className={styles.secondaryText}>
                    {i18next.language === 'ru'
                        ? "Если при заходе в бот у вас появился чёрный экран, просто нажмите Reload Page. Это поможет обновить страницу и загрузить бота корректно."
                        : "If you see a black screen when entering the bot, simply click Reload Page. This will help refresh the page and load the bot correctly."}
                </div>
            </section>
        </div>
    );
};

export default TechWorkPage;



