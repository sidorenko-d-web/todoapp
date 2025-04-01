import React, { useEffect, useState } from 'react';
import styles from './TreeLevelGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from '../../Guide';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IShopItem, RootState, setDimHeader } from '../../../../redux';
import { InventoryCard } from '../../../shop/InventoryCard';
import { setGuideShown } from '../../../../utils';
import { GUIDE_ITEMS } from '../../../../constants';


interface TreeLevelGuideProps {
    onClose: () => void;
    item: IShopItem;
}
export const TreeLevelGuide: React.FC<TreeLevelGuideProps> = ({ onClose, item }) => {
    const { t } = useTranslation('guide');
    const [isOpen, setIsOpen] = useState(true);

    const dispatch = useDispatch();

    dispatch(setDimHeader(true));

    useEffect(() => {
        dispatch(setDimHeader(true));
        dispatch(setDimHeader(true));
    }, []);

    const handleClose = () => {
        setGuideShown(GUIDE_ITEMS.shopPageSecondVisit.TREE_LEVEL_GUIDE_SHOWN);
        setGuideShown(GUIDE_ITEMS.shopPageSecondVisit.ITEM_UPGRADED);
        dispatch(setDimHeader(false));
        onClose();
        setIsOpen(false);
    };

    const itemUpgraded = useSelector((state: RootState) => state.guide.itemUpgraded);

    useEffect(() => {
        if (itemUpgraded) {
            console.log('ITEM UPGRADED!!')
            const timer = setTimeout(() => {
                handleClose();
            }, 500);
            
            return () => clearTimeout(timer);
        }
    }, [itemUpgraded, handleClose]);


    if (!isOpen) {
        dispatch(setDimHeader(false));
        return null;
    }

    return (

        <>
            <Guide align="left"
                zIndex={15000}
                top={'62%'}
                description={
                    <>
                        {/* <span style={{ color: '#2F80ED' }}>{t('g48')}</span> {t('g49')} <span style={{ color: '#E0B01D' }}> {t('g50')}</span>  {t('g51')}
                        <br />
                        <br />
                        {t('g52')} <span style={{ color: '#E0B01D' }}> {t('g53')}</span>. {t('g54')} */}
                        {t('g115')}
                    </>
                }
                onClose={handleClose}>
                {/* <button className={styles.nextBtn} onClick={handleClose}>{t('g56')}</button> */}
                <img src={img1} className={styles.gifImage} height={146} width={140} />

            </Guide>
            <div style={{ position: 'absolute', top: '30%', zIndex: '20000', width: '90vw', left: '5vw' }}>
                <InventoryCard item={item} />
            </div>
        </>
    );
};