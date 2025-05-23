import React, { ReactNode, useEffect, useRef, useState } from "react";
import styles from './SubscribeGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from "../../Guide/Guide";
import { isGuideShown, setGuideShown } from "../../../../utils";
import { GUIDE_ITEMS } from "../../../../constants";
import { useDispatch } from "react-redux";
import { setDimHeader } from "../../../../redux";

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

    const dispatch = useDispatch();

    useEffect(() => {
        if (isGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN) && !isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN)) {
            dispatch(setDimHeader(true));
        }
    }, []);

    const handleClose = () => {
        setGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN);
        onClose();
        dispatch(setDimHeader(false));
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

    if (!isGuideShown(GUIDE_ITEMS.mainPage.FIRST_GUIDE_SHOWN)) {
        return null;
    }

    if (isGuideShown(GUIDE_ITEMS.mainPage.SECOND_GUIDE_SHOWN) && top !== '68%') {
        return null;
    }

    if (!isOpen) return null;

    return (
        <Guide
            align="right"
            zIndex={zIndex}
            description={description}
            top={top}
            onClose={handleClose}
            dimBackground={top==='50%' ? true : false}
            noButton={true}
        >
            <img src={img1} className={styles.image} height={146} width={140} />
        </Guide>
    );
};