import { ReactNode, useEffect, useRef } from 'react';
import styles from './Guide.module.scss';

interface GuideProps {
    align?: 'left' | 'right';
    description: string | ReactNode;
    children?: ReactNode;
    zIndex?: number;
    top?: number | string;
    onClose: () => void; 
}

export const Guide = ({ align = 'left', description, children, zIndex, top, onClose }: GuideProps) => {
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

    return (
        <div className={styles.wrp} style={{ zIndex: zIndex }}>
            <div
                ref={contentRef} 
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