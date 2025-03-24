import { ReactNode, useEffect, useRef } from 'react';
import styles from './Guide.module.scss';
import { isGuideShown } from '../../../utils';
import { GUIDE_ITEMS } from '../../../constants';

interface GuideProps {
    align?: 'left' | 'right';
    description: string | ReactNode;
    children?: ReactNode;
    zIndex?: number;
    top?: number | string;
    onClose: () => void;
    dimBackground?: boolean;
    noButton?: boolean;
}

export const Guide = ({ 
    align = 'left', 
    description, 
    children, 
    zIndex, 
    top, 
    onClose, 
    dimBackground = true ,
    noButton = false,
}: GuideProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(noButton) {
            const handleClickOutside = (event: MouseEvent) => {
                if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
                    onClose();
                }
            };
    
            document.addEventListener('mousedown', handleClickOutside);
    
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [onClose]);

    const treeGuideDisplaying = isGuideShown(GUIDE_ITEMS.shopPageSecondVisit.TREE_LEVEL_GUIDE_SHOWN) 
        && !isGuideShown(GUIDE_ITEMS.treePage.TREE_GUIDE_SHONW);

    return (
        <div
            className={`${styles.wrp} ${dimBackground ? (treeGuideDisplaying ?  styles.dimmedTree :  styles.dimmed) : ''}`}
            style={{ zIndex }}
        >
            <div
                ref={contentRef}
                className={`${styles.content} ${align === 'left' ? styles.left : styles.right}`}
                style={{ top }}
            >
                <div className={styles.description}>
                    {description}
                </div>
                {children}
            </div>
        </div>
    );
};
