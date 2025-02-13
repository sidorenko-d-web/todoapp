import React, { useState } from "react";
import { Guide } from "../../Guide";

import styles from './WelcomeToShopGuide.module.scss';

import gif from '../../../../assets/gif/guide1.gif';


interface WelcomeToShopGuideProps {
    onClose: () => void;
}
export const WelcomeToShopGuide: React.FC<WelcomeToShopGuideProps> = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <Guide
            description={
                <>
                    Каждая интеграция дает <span style={{ color: '#2F80ED' }}>подписчиков</span> и <span style={{ color: '#EC7913' }}>баллы</span>. Ты можешь увеличить доход, купив в магазине аппаратуру и предметы в комнату!
                    <br />
                    Давай купим технику, чтобы начать делать интеграции и зарабатывать!
                </>
            }
            top={'50%'}
            onClose={handleClose}
        >
            <button className={styles.nextBtn} onClick={handleClose}>Вперёд!</button>
            <img src={gif} className={styles.gifImage} />
        </Guide>
    )
}