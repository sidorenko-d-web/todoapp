import React, { useEffect, useState } from "react";
import styles from './FreezeGuide.module.scss';

import img1 from '../../../../assets/gif/guide4.gif';
import { Guide } from "../../Guide/Guide";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { setDimHeader } from "../../../../redux";

interface FreezeGuideProps {
    onClose: () => void;
}
export const FreezeGuide: React.FC<FreezeGuideProps> = ({ onClose }) => {
    const { t } = useTranslation('guide');
    const [isOpen, setIsOpen] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setDimHeader(true));
    }, []);

    const handleClose = () => {
        //dispatch(setDimHeader(false));
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (

        <>
            <Guide align="right"
                noButton={true}
                zIndex={110}
                top={'3%'}
                description={
                    <>
                        Если ты не сделашь за день ни одной интеграции твой стрик обнулится, а подписчики начнут уходить...
                        Но иногда этого можно избежать с помощью заморозки! 1 заморозка позволяет пропустить 1 день Пуш-линии без потери прогресса.
                        Ты найдешь их в сундуках!
                    </>
                }
                onClose={handleClose}>
                <button className={styles.nextBtn} onClick={handleClose}>{'Супер!'}</button>
                <img src={img1} className={styles.gifImage} height={146} width={140} />
            </Guide>
        </>
    );
};