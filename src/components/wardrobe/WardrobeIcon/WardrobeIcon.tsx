import React, { useEffect, useRef } from 'react';
import styles from './WardrobeIcon.module.scss';

// import profileIconPlaceholder from '../../../assets/icons/profile-icon-placeholder.svg';
import wardrobeIcon from '../../../assets/images/start-room/wardrobe-bg.svg';
import { SpineGameObject, SpinePlugin } from '@esotericsoftware/spine-phaser';

interface WardrobeIconProps {
  imageUrl?: string;
}

const proxyImageUrl = (url: string) => url.replace('https://storage.yandexcloud.net', '/api/miniapp-v2-dev');

export const WardrobeIcon: React.FC<WardrobeIconProps> = () => {
  const jsonUrl = new URL(`https://storage.yandexcloud.net/miniapp-v2-dev/spine-boy.json`).href;
  const atlasUrl = new URL(`https://storage.yandexcloud.net/miniapp-v2-dev/spine-boy.atlas`).href;

  const gameRef = useRef<Phaser.Game | null>(null);

  const width = window.screen.width - 30;

  useEffect(() => {
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
        this.spineObject = this.add.spine(width / 2, width / 2, 'data', 'atlas');
        this.spineObject.scale = 1;
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: width,
      height: width,
      transparent: true,
      scene: [SpineScene],
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
  });
  return (
    <div className={styles.wrp}>
      <img src={wardrobeIcon} alt="Wardrobe Icon" />
      <div id={'player'} style={{ position: 'absolute', top: 0, borderRadius: 8, overflow: 'hidden' }} />
    </div>
  );
};