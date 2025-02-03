import { ReactNode, useEffect, useRef } from 'react';
import styles from './Guide.module.scss';

interface GuideProps {
    align?: 'left' | 'right';
    description: string | ReactNode;
    children?: ReactNode;
    zIndex?: number;
    top?: number | string;
    onClose: () => void; // Add onClose prop to handle closing the guide
}

export const Guide = ({ align = 'left', description, children, zIndex, top, onClose }: GuideProps) => {
    const contentRef = useRef<HTMLDivElement>(null); // Ref for the content div

    // Handle clicks outside the content
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
                onClose(); // Close the guide if clicked outside the content
            }
        };

        // Attach the event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className={styles.wrp} style={{ zIndex: zIndex }}>
            <div
                ref={contentRef} // Attach the ref to the content div
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