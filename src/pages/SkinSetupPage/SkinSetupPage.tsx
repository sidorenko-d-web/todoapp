import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './SkinSetupPage.module.scss';
import wardrobeBg from '../../assets/images/start-room/wardrobe-bg.svg';
import skinPlaceholder from '../../assets/icons/skin-placeholder.svg';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/shared';
import { IShopSkin, useGetInventorySkinsQuery } from '../../redux';
import { ICharacterResponse, useGetCharacterQuery, useUpdateCharacterMutation } from '../../redux/api/character';
import clsx from 'clsx';
import { svgHeadersString } from '../../constants';
import { SpinePlugin } from '@esotericsoftware/spine-phaser';
import { WardrobeSpineScene } from '../../constants/wardrobeAnimation';
import WhiteNoiseCanvas from '../../components/WhiteNoise/WhiteNoise';

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
  const [size, setSize] = useState([0, 0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const dpi = window.devicePixelRatio;
  const personScale = 0.13 * dpi;

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

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
      const data = (await updateCharacter(body)).data;
      if (data) {
        handleChangeSkin(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sceneRef = useRef<HTMLDivElement | null>(null);

  const gameRef = useRef<Phaser.Game | null>(null);
  const spineSceneRef = useRef<SpineScene | null>(null);

  class SpineScene extends WardrobeSpineScene {
    create() {
      try {
        this.createPerson(personScale);
      } catch (error: any) {
        if (error.message === 'add.spine') {
          setSize(prev => [prev[0] + 1, prev[1]]);
        }
      }
      spineSceneRef.current = this;
      this.changeSkin(personScale, character);
      setIsLoaded(true);
    }
  }

  const handleChangeSkin = (updatedCharacter: ICharacterResponse) => {
    if (spineSceneRef.current) {
      spineSceneRef.current.changeSkin(personScale, updatedCharacter);
    }
  };

  useEffect(() => {
    if (!sceneRef.current || isLoading) return;
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 280 * dpi,
      height: 280 * dpi,
      scene: [SpineScene],
      transparent: true,
      canvasStyle: `width: ${280}px; height: ${280}px`,
      plugins: {
        scene: [{ key: 'player1', plugin: SpinePlugin, mapping: 'spine' }],
      },
      parent: 'player1',
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [isLoading, size]);

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
  ];

  inventorySkinsData?.skins.forEach(skin => {
    if (skin.wear_location === 'legs') {
      categorizedSkins.lower_body.push(skin);
    } else if (skin.wear_location in categorizedSkins) {
      categorizedSkins[skin.wear_location as keyof CategorizedSkins].push(skin);
    }
  });

  return (
    <>
      <WhiteNoiseCanvas />
      <div className={styles.root}>
        <div className={styles.skinControls}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarPreview}>
              <img src={wardrobeBg} alt="bg" />
              <div
                id={'player1'}
                ref={sceneRef}
                style={{ position: 'absolute', top: 0, borderRadius: 8, overflow: 'hidden', width: 280, height: 280 }}
              />
              {!isLoaded && (
                <div className={styles.loader}>
                  <p>Loading</p>
                </div>
              )}
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
                className={clsx(
                  styles.option,
                  character?.skins.map(item => item.id).includes(skin.id) && styles.selected,
                )}
              >
                <img src={skin.image_url + svgHeadersString || skinPlaceholder} />
              </Button>
            ))}
          </div>
        </div>
        <Button className={styles.continueButton} onClick={onContinue}>
          {t('w7')}
        </Button>
        <div className={styles.selectText}>{t('s35')}</div>
      </div>
    </>
  );
};
