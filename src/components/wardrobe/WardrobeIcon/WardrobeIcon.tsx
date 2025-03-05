import React, { useEffect, useRef } from 'react';
import styles from './WardrobeIcon.module.scss';

// import profileIconPlaceholder from '../../../assets/icons/profile-icon-placeholder.svg';
import wardrobeIcon from '../../../assets/images/start-room/wardrobe-bg.svg';
import { SpinePlugin } from '@esotericsoftware/spine-phaser';
import { WardrobeTabs } from '../WardrobeTabs';
import { ICharacterResponse, useGetCharacterQuery } from '../../../redux/api/character';
import { WardrobeSpineScene } from '../../../constants/wardrobeAnimation';

interface WardrobeIconProps {
  imageUrl?: string;
}

export const WardrobeIcon: React.FC<WardrobeIconProps> = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  const gameRef = useRef<Phaser.Game | null>(null);
  const spineSceneRef = useRef<SpineScene | null>(null);

  const { data: character, isLoading } = useGetCharacterQuery();

  class SpineScene extends WardrobeSpineScene {
    create() {
      const width = this.sys.game.config.width as number;
      const center = width / 2;
      if (!this.add.spine) return;
      this.spineObject = this.add.spine(center, center, 'data', 'atlas');
      this.spineObject.scale = 0.15;
      spineSceneRef.current = this;
  
      this.changeSkin(character);
    }
  }

  useEffect(() => {
    if (!sceneRef.current || isLoading) return;

    const width = sceneRef.current.offsetWidth;
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: width,
      height: sceneRef.current.offsetHeight,
      scene: [SpineScene],
      transparent: true,
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
  }, [isLoading]);

  const handleMakeHappy = (updatedCharacter: ICharacterResponse) => {
    if (spineSceneRef.current) {
      spineSceneRef.current.changeSkin(updatedCharacter);
      spineSceneRef.current.makeHappy();
    }
  };

  return (
    <>
      <div className={styles.wrp}>
        <img src={wardrobeIcon} alt="Wardrobe Icon" />
        <div
          id={'player1'}
          ref={sceneRef}
          style={{ position: 'absolute', top: 0, borderRadius: 8, overflow: 'hidden', width: '100%', height: '100%' }}
        />
      </div>
      <WardrobeTabs wardrobe={true} handleChangeSkin={handleMakeHappy} />
    </>
  );
};
