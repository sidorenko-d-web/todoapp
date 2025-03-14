import React, { ReactNode, useEffect, useRef, useState } from "react";
import styles from './SubscribeGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";

interface CreateIntegrationGuideProps {
    description: ReactNode;
    zIndex: number;
    top: string;
    onClose: () => void;
}

export const SubscrieGuide: React.FC<CreateIntegrationGuideProps> = ({
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

    const contentRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!isOpen) return null;
    
    return (
        <Guide
            align="right"
            zIndex={zIndex}
            description={description}
            top={top}
            onClose={handleClose}
            dimBackground={false}
            noButton={true}
        >
            <img src={img1} className={styles.image} height={146} width={140} />
        </Guide>
    );
};