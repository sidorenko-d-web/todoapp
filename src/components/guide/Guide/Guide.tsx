import { ReactNode } from 'react';
import styles from './Guide.module.scss';

interface GuideProps {
    align?: 'left' | 'right'; 
    description: string;
    children?: ReactNode;
}

export const Guide = ({ align = 'left', description, children }: GuideProps) => {
    return (
        <div className={styles.wrp}>
            <div className={`${styles.content} ${align === 'left' ? styles.left : styles.right}`}>
                <div className={styles.description}>
                    {description}
                </div>
                {children}
            </div>
        </div>
    );
};