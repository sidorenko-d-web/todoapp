import React, { useState } from 'react';
import styles from './WardrobeTabs.module.scss';

import { useGetInventorySkinsQuery } from '../../../redux/api/inventory/api';
import skinPlaceholder from '../../../assets/icons/skin-placeholder.svg';
import { IShopSkin } from '../../../redux';
import { Button } from '../../shared';
import { useTranslation } from 'react-i18next';
import { svgHeadersString } from '../../../constants';

type CategorizedSkins = {
  head: IShopSkin[];
  face: IShopSkin[];
  skin_color: IShopSkin[];
  upper_body: IShopSkin[];
  lower_body: IShopSkin[];
  entire_body: IShopSkin[];
};

interface WardrobeTabsProps {
  setSelectedSkinUrl: (url: string) => void;
}

export const WardrobeTabs: React.FC<WardrobeTabsProps> = ({ setSelectedSkinUrl }) => {
  const { t } = useTranslation('wardrobe');
  const { data: inventorySkinsData, isLoading } = useGetInventorySkinsQuery();
  const [activeTab, setActiveTab] = useState('head');
  const [selected, setSelected] = useState<string | null>(null);

  console.log(inventorySkinsData);

  if (isLoading || !inventorySkinsData) {
    return <p>Loading skins...</p>;
  }

  const categorizedSkins: CategorizedSkins = {
    head: [],
    face: [],
    skin_color: [],
    upper_body: [],
    lower_body: [],
    entire_body: [],
  };

  const categories = [
    { name: t('w3'), key: 'head' },
    { name: t('w4'), key: 'face' },
    { name: t('w4-1'), key: 'skin_color' },
    { name: t('w5'), key: 'upper_body' },
    { name: t('w6'), key: 'lower_body' }, // Merged legs & feet //bottom wear is too long to display
    { name: 'VIP', key: 'entire_body' },
  ];

  inventorySkinsData.skins.forEach(skin => {
    if (skin.wear_location === 'legs') {
      categorizedSkins.lower_body.push(skin);
    } else if (skin.wear_location in categorizedSkins) {
      skin.wear_location === 'skin_color' && console.log('object')
      categorizedSkins[skin.wear_location as keyof CategorizedSkins].push(skin);
    }
  });

  console.log(categorizedSkins);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {categories.map(({ name, key }) => (
          <Button
            key={key}
            className={`${styles.tab} ${activeTab === key ? styles.activeTab : ''} ${
              key === 'entire_body' && activeTab !== key ? styles.vipTab : ''
            }`}
            onClick={() => setActiveTab(key)}
          >
            {name}
          </Button>
        ))}
      </div>

      <div className={styles.grid}>
        {categorizedSkins[activeTab as keyof CategorizedSkins]?.map(skin => (
          <Button
            key={skin.id}
            className={`${styles.option} ${selected === skin.id ? styles.selected : ''}`}
            onClick={() => {
              setSelected(skin.id);
              setSelectedSkinUrl(skin.image_url);
            }}
          >
            <img src={skin.image_url + svgHeadersString || skinPlaceholder} />
          </Button>
        ))}
      </div>
    </div>
  );
};
