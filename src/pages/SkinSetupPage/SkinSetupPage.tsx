import { useState } from 'react';
import styles from './SkinSetupPage.module.scss';
import wardrobeBg from '../../assets/images/start-room/wardrobe-bg.svg';
import skinPlaceholder from '../../assets/icons/skin-placeholder.svg';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/shared';
import { IShopSkin, useGetInventorySkinsQuery } from '../../redux';
import { useGetCharacterQuery, useUpdateCharacterMutation } from '../../redux/api/character';
import clsx from 'clsx';
import { svgHeadersString } from '../../constants';

interface SkinSetupPageProps {
  onContinue: () => void;
}

type CategorizedSkins = {
  head: IShopSkin[];
  face: IShopSkin[];
  skin_color: IShopSkin[];
  upper_body: IShopSkin[];
  lower_body: IShopSkin[];
  entire_body: IShopSkin[];
};

export const SkinSetupPage = ({ onContinue }: SkinSetupPageProps) => {
  const { t } = useTranslation('wardrobe');
  const { data: inventorySkinsData, isLoading } = useGetInventorySkinsQuery();
  const [activeTab, setActiveTab] = useState('head');
  const { data: character } = useGetCharacterQuery();
  const [updateCharacter] = useUpdateCharacterMutation();

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
      skin.wear_location === 'skin_color' && console.log('object');
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
      const res = await updateCharacter(body);
      console.log(res);
    } catch (error) {}
  };

  return (
    <div className={styles.root}>
      <div className={styles.avatarSection}>
        <div className={styles.avatarPreview}>
          <img src={wardrobeBg} alt="bg" />
        </div>
        <div className={styles.bodyPartsContainer}>
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
      </div>
      <div className={styles.skinOptionsGrid}>
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
      <Button className={styles.continueButton} onClick={onContinue}>
        {t('s34')}
      </Button>
      <div className={styles.selectText}>{t('s35')}</div>
    </div>
  );
};
