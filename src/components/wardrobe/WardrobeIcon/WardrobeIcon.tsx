import React, { useEffect, useRef } from 'react';
import styles from './WardrobeIcon.module.scss';

// import profileIconPlaceholder from '../../../assets/icons/profile-icon-placeholder.svg';
import wardrobeIcon from '../../../assets/images/start-room/wardrobe-bg.svg';
import { SpineGameObject, SpinePlugin } from '@esotericsoftware/spine-phaser';
import { WardrobeTabs } from '../WardrobeTabs';

interface WardrobeIconProps {
  imageUrl?: string;
}

const proxyImageUrl = (url: string) => url.replace('https://storage.yandexcloud.net', '/api/miniapp-v2-dev');

export const WardrobeIcon: React.FC<WardrobeIconProps> = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  const jsonUrl = new URL(`https://storage.yandexcloud.net/miniapp-v2-dev/anfas_happy.json`).href;
  const atlasUrl = new URL(`https://storage.yandexcloud.net/miniapp-v2-dev/anfas_happyatlas.txt`).href;

  const gameRef = useRef<Phaser.Game | null>(null);
  const spineSceneRef = useRef<SpineScene | null>(null);

  class SpineScene extends Phaser.Scene {
    jsonUrl: string | undefined;
    atlasUrl: string | undefined;
    spineObject: SpineGameObject | null;
    constructor() {
      super({ key: 'player' });
      this.spineObject = null;
    }

    preload() {
      this.load.spineJson('data', proxyImageUrl(jsonUrl));
      this.load.spineAtlas('atlas', proxyImageUrl(atlasUrl));
    }

    create() {
      const width = this.sys.game.config.width as number;
      const center = width / 2;
      if (!this.add.spine) return;
      this.spineObject = this.add.spine(center, center, 'data', 'atlas');
      this.spineObject.scale = 0.15;
      spineSceneRef.current = this;
    }
    
    makeHappy() {
      if (!this.spineObject) return;
      this.spineObject.animationState.setAnimation(0, 'happy');
    }
  }

  useEffect(() => {
    if (!sceneRef.current) return;

    const width = sceneRef.current.offsetWidth;
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: width,
      height: sceneRef.current.offsetHeight,
      scene: [SpineScene],
      transparent: true,
      plugins: {
        scene: [{ key: 'player', plugin: SpinePlugin, mapping: 'spine' }],
      },
      parent: 'player',
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const handleMakeHappy = () => {
    if (spineSceneRef.current) {
      spineSceneRef.current.makeHappy();
    }
  };

  return (
    <>
      <div className={styles.wrp}>
        <img src={wardrobeIcon} alt="Wardrobe Icon" />
        <div
          id={'player'}
          ref={sceneRef}
          style={{ position: 'absolute', top: 0, borderRadius: 8, overflow: 'hidden', width: '100%', height: '100%' }}
        />
      </div>
      <WardrobeTabs wardrobe={true} handleChangeSkin={handleMakeHappy} />
    </>
  );
};
