import { ReactNode } from 'react';
import styles from './Guide.module.scss';

interface GuideProps {
    align?: 'left' | 'right';
    description: string | ReactNode;
    children?: ReactNode;
    zIndex?: number;
    top?: number | string; // Add 'top' prop for dynamic positioning
}

export const Guide = ({ align = 'left', description, children, zIndex, top }: GuideProps) => {
    return (
        <div className={styles.wrp} style={{ zIndex: zIndex }}>
            <div
                className={`${styles.content} ${align === 'left' ? styles.left : styles.right}`}
                style={{ top: top }}
            >
                <div className={styles.description}>
                    {description}
                </div>
                {children}
            </div>
        </div>
    );
};