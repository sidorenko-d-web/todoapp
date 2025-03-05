import React, { useState } from 'react';
import styles from './WardrobeTabs.module.scss';

import { useGetInventorySkinsQuery } from '../../../redux/api/inventory/api';
import skinPlaceholder from '../../../assets/icons/skin-placeholder.svg';
import { IShopSkin } from '../../../redux';
import { Button } from '../../shared';
import { useTranslation } from 'react-i18next';
import { svgHeadersString } from '../../../constants';
import { useGetCharacterQuery, useUpdateCharacterMutation } from '../../../redux/api/character';
import clsx from 'clsx';

type CategorizedSkins = {
  head: IShopSkin[];
  face: IShopSkin[];
  skin_color: IShopSkin[];
  upper_body: IShopSkin[];
  lower_body: IShopSkin[];
  entire_body: IShopSkin[];
};

interface WardrobeTabsProps {
  wardrobe?: boolean;
  handleChangeSkin: (any: any) => void;
}

export const WardrobeTabs: React.FC<WardrobeTabsProps> = ({ wardrobe, handleChangeSkin }) => {
  const { t } = useTranslation('wardrobe');
  const { data: inventorySkinsData, isLoading } = useGetInventorySkinsQuery();
  const [activeTab, setActiveTab] = useState('head');
  const { data: character } = useGetCharacterQuery();
  const [updateCharacter] = useUpdateCharacterMutation();

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
      categorizedSkins[skin.wear_location as keyof CategorizedSkins].push(skin);
    }
  });

  const handleSelectSkin = async (item: IShopSkin) => {
    if (!character) return;
    const prevSkins = {
      head: character?.skins.find(_item => _item.wear_location === 'head')?.id,
      face: character?.skins.find(_item => _item.wear_location === 'face')?.id,
      legs: character?.skins.find(_item => _item.wear_location === 'legs')?.id,
      skin_color: character?.skins.find(_item => _item.wear_location === 'skin_color')?.id,
      upper_body: character?.skins.find(_item => _item.wear_location === 'upper_body')?.id,
      entire_body: character?.skins.find(_item => _item.wear_location === 'entire_body')?.id,
    };
    prevSkins[item.wear_location] = item.id;
    const body = {
      head_skin_id: prevSkins.head,
      face_skin_id: prevSkins.face,
      upper_body_skin_id: prevSkins.upper_body,
      legs_skin_id: prevSkins.legs,
      skin_color_id: prevSkins.skin_color,
      gender: character.gender, 
    };
    try {
      handleChangeSkin((await updateCharacter(body)).data);
    } catch (error) {}
  };

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

      <div className={clsx(styles.grid, wardrobe && styles.wardrobe)}>
        {categorizedSkins[activeTab as keyof CategorizedSkins]?.map(skin => (
          <Button
            key={skin.id}
            onClick={() => handleSelectSkin(skin)}
            className={clsx(styles.option, character?.skins.map(item => item.id).includes(skin.id) && styles.selected)}
          >
            <img src={skin.image_url + svgHeadersString || skinPlaceholder} />
          </Button>
        ))}
      </div>
    </div>
  );
};
