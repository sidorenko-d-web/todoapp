import React, { useState } from "react";
import styles from './InitialGuide.module.scss';

import img1 from '../../../assets/gif/guide1.gif';
import { Guide } from "../Guide/Guide";

export const InitialGuide: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <Guide align="left" description="Меня зовут Push! Давай покажу, как тут все устроено и как ты сможешь заработать реальные деньги с Apusher! ">
            <button onClick={handleClose}>Вперёд!</button>
            <img src={img1} className={styles.image} height={146} width={140} />
        </Guide>
    );
};