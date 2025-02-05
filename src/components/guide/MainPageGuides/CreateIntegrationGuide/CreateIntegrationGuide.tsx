import React, { ReactNode, useState } from "react";
import styles from './CreateIntegrationGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";

interface CreateIntegrationGuideProps {
    description: ReactNode;
    zIndex: number;
    top: string;
    onClose: () => void;
}

export const CreateIntegrationGuide: React.FC<CreateIntegrationGuideProps> = ({
    description,
    zIndex,
    top,
    onClose,
}) => {
     const [isOpen, setIsOpen] = useState(true);
    
     const handleClose = () => {
        onClose();
        setIsOpen(false);
    };

    if (!isOpen) return null;
    
    return (
        <Guide
            align="right"
            zIndex={zIndex}
            description={description}
            top={top}
            onClose={handleClose}
            dimBackground={false}
        >
            <img src={img1} className={styles.image} height={146} width={140} />
        </Guide>
    );
};