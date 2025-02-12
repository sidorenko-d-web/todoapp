import React, { useState } from "react";
import { Guide } from "../../Guide";

import styles from './BackToMainPageGuide.module.scss';

import gif from '../../../../assets/gif/guide1.gif';
import { setGuideShown } from "../../../../utils";
import { GUIDE_ITEMS } from "../../../../constants";
import { useDispatch } from "react-redux";
import { setCreateIntegrationButtonGlowing } from "../../../../redux/slices/guideSlice";


interface BackToMainPageGuideProps {
    onClose: () => void;
}
export const BackToMainPageGuide: React.FC<BackToMainPageGuideProps> = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(true);


    const dispatch = useDispatch();

    const handleClose = () => {
        setGuideShown(GUIDE_ITEMS.shopPage.BACK_TO_MAIN_PAGE_GUIDE);
        dispatch(setCreateIntegrationButtonGlowing(true));
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;


    return (
        <Guide
            align="right"
            description={
                <>
                    Супер! Теперь у тебя есть <span style={{ color: '#2F80ED' }}>подписка</span> и <span style={{ color: '#2F80ED' }}>тетрадь</span>.
                    <br />
                    <br />
                    Ты можешь сделать свою первую интеграцию! Давай вернёмся в комнату и сделаем это!
                </>
            }
            top={'50%'}
            onClose={handleClose}
        >
            <button className={styles.nextBtn} onClick={handleClose}>В комнату!</button>
            <img src={gif} className={styles.gifImage} />
        </Guide>
    )
}