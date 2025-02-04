import React, { ReactNode, useState } from "react";
import styles from './CreatingIntegrationGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";

interface CreatingIntegrationGuideProps {
    onClose: () => void;
    description: ReactNode;
    buttonText: string;
}
export const CreatingIntegrationGuide: React.FC<CreatingIntegrationGuideProps> = ({ onClose, description, buttonText }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (

        <Guide align="left"
            zIndex={110}
            top={'65%'}
            description={
               description
            }
            onClose={onClose}>
            <button className={styles.nextBtn} onClick={handleClose}>{buttonText}</button>
            <img src={img1} className={styles.gifImage} height={146} width={140} />
        </Guide>
    );
};