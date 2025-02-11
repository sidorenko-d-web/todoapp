import React, { useState } from "react";
import styles from './GetCoinsGuide.module.scss';

import img1 from '../../../../assets/gif/guide4.gif';
import { Guide } from "../../Guide/Guide";

import coin from '../../../../assets/icons/coin.png';
import { useGetUserQuery } from "../../../../redux";

interface GetCoinsGuideProps {
    onClose: () => void;
}
export const GetCoinsGuide: React.FC<GetCoinsGuideProps> = ({ onClose }) => {

    const { data } = useGetUserQuery();

    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <Guide align="left"
            zIndex={110}
            top={'25%'}
            description={
                <>
                    Ах, да... для этого нужно немного вложиться... 
                    <br />
                    <br />
                    Держи 250 баллов для твоего блогерского старта!
                    <br />
                    <br />
                    {data?.is_invited
                         && <span>И еще <span style={{ color: '#EC7913' }}>150 баллов</span> ты получаешь от друга, который тебя пригласил!!</span>}
                </>
            }
            onClose={onClose}>
            <button className={styles.nextBtn} onClick={handleClose}>{`Забрать ${data?.is_invited ? '400' : '250'}`}<img src={coin} width={14} height={14} /></button>
            <img src={img1} className={styles.gifImage} height={146} width={140} />
        </Guide>
    );
};