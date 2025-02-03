import React, { ReactNode } from "react";
import styles from './CreateIntegrationGuide.module.scss';

import img1 from '../../../assets/gif/guide1.gif';
import { Guide } from "../Guide/Guide";


interface CreateIntegrationGuideProps {
    description: ReactNode;
    zIndex: number;
    top: string;
}
export const CreateIntegrationGuide: React.FC <CreateIntegrationGuideProps> = ({description, zIndex, top}) => {

    return (
        <Guide align="right" zIndex={zIndex}
            description={
                description
            }
            top={top}
            >
            <img src={img1} className={styles.image} height={146} width={140} />
        </Guide>
    );
};