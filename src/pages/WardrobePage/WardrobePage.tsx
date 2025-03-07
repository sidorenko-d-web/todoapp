import React from 'react';
import styles from './WardrobePage.module.scss';
import { WardrobeIcon, WardrobeInfo } from '../../components';

export const WardrobePage: React.FC = () => {
  // const { isLoading: isInventorySkinsLoading } = useGetInventorySkinsQuery();
  // const { isLoading: isCharacterLoading } = useGetCharacterQuery();

  // const isLoading = (
  //   isInventorySkinsLoading ||
  //   isCharacterLoading
  // );

  // if (isLoading) return <Loader />;

  return (
    <div className={styles.wrp}>
      <WardrobeInfo />
      <WardrobeIcon />
    </div>
  );
};
