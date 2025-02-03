import React, { ReactNode } from "react";
import styles from './CreateIntegrationGuide.module.scss';

import img1 from '../../../assets/gif/guide1.gif';
import { Guide } from "../Guide/Guide";

interface CreateIntegrationGuideProps {
    description: ReactNode;
    zIndex: number;
    top: string;
    onClose: () => void; // Add onClose prop
}

export const CreateIntegrationGuide: React.FC<CreateIntegrationGuideProps> = ({
    description,
    zIndex,
    top,
    onClose, // Destructure onClose
}) => {
    return (
        <Guide
            align="right"
            zIndex={zIndex}
            description={description}
            top={top}
            onClose={onClose} // Pass onClose to Guide
        >
            <img src={img1} className={styles.image} height={146} width={140} alt="Guide GIF" />
        </Guide>
    );
};