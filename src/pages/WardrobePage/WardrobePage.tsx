import React from 'react';
import styles from './WardrobePage.module.scss';
import { Loader, WardrobeIcon, WardrobeInfo, WardrobeTabs } from '../../components';
import { useGetInventorySkinsQuery } from '../../redux';
import { useGetCharacterQuery } from '../../redux/api/character';

export const WardrobePage: React.FC = () => {
  const { isLoading: isInventorySkinsLoading } = useGetInventorySkinsQuery();
  const { isLoading: isCharacterLoading } = useGetCharacterQuery();

  const isLoading = (
    isInventorySkinsLoading ||
    isCharacterLoading
  );

  if (isLoading) return <Loader />;

  return (
    <div className={styles.wrp}>
      <WardrobeInfo />
      <WardrobeIcon />
      <WardrobeTabs wardrobe={true} />
    </div>
  );
};
