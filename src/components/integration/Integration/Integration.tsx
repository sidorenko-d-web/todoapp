import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from './Integration.module.scss';
import { TypeWearLocation, useGetCharacterQuery, useGetEquipedQuery } from '../../../redux';
import { SpineSceneBase, buildLink, walls } from '../../../constants';
import { Skin, SpinePlugin } from '@esotericsoftware/spine-phaser';
import { Loader } from '../../Loader';
import { useRoomItemsSlots } from '../../../../translate/items/items';

interface props {
  compaignImage?: string;
}

export const Integration: React.FC<props> = ({ compaignImage }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const spineSceneRef = useRef<SpineSceneBase | null>(null);

  const { data: room, isLoading: isRoomLoading } = useGetEquipedQuery(undefined);

  const [size, setSize] = useState([0, 0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const character = useGetCharacterQuery(undefined);
  const { desc, pc, chair, wall } = useRoomItemsSlots();

  const dpi = window.devicePixelRatio ?? 1;

  const sleep = (m: number) => new Promise(r => setTimeout(r, m));

  useEffect(() => {
    if (!sceneRef.current || character?.isLoading || !room) return;
    console.log('object');

    const center = ((window.innerWidth - 30) * dpi) / 2;
    const contextProps = { equipped_items: room?.equipped_items, center: center - 10 * dpi };

    const equippedDesc = room?.items.find(item => desc.name.includes(item.name));
    const equippedPc = room?.items.find(item => pc.name.includes(item.name));

    class SpineScene extends SpineSceneBase {
      preload() {
        if (typeof this.add.spine !== 'function') {
          sleep(1000);
          setSize(prev => [prev[0] + 1, prev[1]]);
        } else {
          if (!(sceneRef.current && gameRef.current)) return;

          this.loadPerson();
          if (equippedDesc) {
            this.load.svg('desc', buildLink()?.svgLink(equippedDesc.image_url), {
              width: 190 * dpi,
              height: 190 * dpi,
            });
          } else {
            this.load.svg('desc', this.createLink('table', 'base'), { width: 190 * dpi, height: 190 * dpi });
          }

          if (equippedPc) {
            this.load.svg('pc', buildLink()?.svgLink(equippedPc.image_url), { width: 80 * dpi, height: 80 * dpi });
          }
        }
      }

      create() {
        if (typeof this.add.spine !== 'function') {
          sleep(500);
          setSize(prev => [prev[0] + 1, prev[1]]);
        } else {
          this.createPerson(contextProps, true, 110);
          if (this.person) {
            this.person.scale = 0.09 * dpi;
          }

          const center = ((window.innerWidth - 30) * dpi) / 2;
          
          if (equippedDesc) {
            const desc = this.add.image(center - 10, 180 * dpi, 'desc');
            desc.setDepth(3);
          }

          if (equippedPc) {
            const pc = this.add.image(center - 20 * dpi, 135 * dpi, 'pc');
            pc.setDepth(4);
          }

          this.person?.setDepth(2);

          // Разделение создания анимированных и статичных предмето

          spineSceneRef.current = this;
          this.changeSkin();
          setTimeout(() => setIsLoaded(true), 1);
        }
      }

      changeSkin() {
        if (!this.person) return;
        const allSkins = this.person.skeleton.data.skins;
        const face = allSkins.find(item => item.name.includes(getSkin('face') ?? 'лицо 1'))!;
        const headSkin = allSkins.find(item => item.name.includes(getSkin('head') ?? 'голова 18'))!;
        const bottomSkin = allSkins.find(item => item.name.includes(getSkin('legs') ?? 'штаны базовые'))!;
        const skinColor = allSkins.find(item => item.name.includes(getSkin('skin_color') ?? 'кожа базовая'))!;
        const upSkin = allSkins.find(item => item.name.includes(getSkin('upper_body') ?? 'футболка_базовая'))!;

        const skin = new Skin('created');
        skin.name = face.name.split('/')[1];
        skin.addSkin(bottomSkin);
        skin.addSkin(upSkin);
        skin.addSkin(headSkin);
        skin.addSkin(face);
        skin.addSkin(skinColor);

        this.person.skeleton.setSkin(skin);
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: (window.innerWidth - 30) * dpi,
      height: 200 * dpi,
      scene: [SpineScene],
      canvasStyle: `width: ${window.innerWidth - 30}px; height: ${200}px`,
      autoRound: false, // Отключаем округление размеров
      plugins: {
        scene: [{ key: 'player', plugin: SpinePlugin, mapping: 'spine' }],
      },
      parent: 'player',
      transparent: true,
      render: {
        antialias: true,
        antialiasGL: true,
      },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        console.log('destroy');
        setIsLoaded(false);
        gameRef.current.destroy(true);
        gameRef.current = null;
        spineSceneRef.current = null;
      }
    };
  }, [sceneRef, size[0], character?.isLoading]);

  const getSkin = useCallback(
    (wear_location: TypeWearLocation) => {
      return character?.data?.skins.find(item => item.wear_location === wear_location)?.name.toLowerCase();
    },
    [character?.data],
  );

  const _wall = room?.items.find(item => wall.name.includes(item.name));

  const currentWall = walls[(_wall?.item_rarity! + _wall?.item_premium_level) as keyof typeof walls] ?? walls.redbase;

  return (
    <div className={styles.integration} style={{ backgroundImage: `url(${currentWall})` }}>
      <img src={currentWall.image} className={styles.background} />
      <img src={compaignImage} className={styles.compaign} />
      {(!isLoaded || isRoomLoading) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 100001,
          }}
        >
          <Loader />
        </div>
      )}
      <div
        ref={sceneRef}
        id="player"
        style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1000, scale: 0.7 }}
      ></div>
    </div>
  );
};
