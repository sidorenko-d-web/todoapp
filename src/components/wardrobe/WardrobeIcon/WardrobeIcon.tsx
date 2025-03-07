import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './WardrobeIcon.module.scss';
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
  const spineSceneRef = useRef<any | null>(null);

  const [size, setSize] = useState([0, 0]);
  const { data: character, isLoading } = useGetCharacterQuery();

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  class SpineScene extends WardrobeSpineScene {
    create() {
      console.log('SpineScene');
      this.createPerson();
      spineSceneRef.current = this;
      this.changeSkin(character);
    }
  }

  useEffect(() => {
    if (!sceneRef.current || isLoading) return;
    const width = sceneRef.current.offsetWidth;

    const createAnimation = () => {
      console.log('useEffect');
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: width,
        height: sceneRef.current!.offsetHeight,
        scene: [SpineScene],
        transparent: true,
        plugins: {
          scene: [{ key: 'SpinePlugin', plugin: SpinePlugin, mapping: 'spine' }],
        },
        parent: 'player1',
      };

      gameRef.current = new Phaser.Game(config);
    };

    createAnimation();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        spineSceneRef.current = null;
      }
    };
  }, [isLoading, size]);

  const handleMakeHappy = (updatedCharacter: ICharacterResponse) => {
    if (spineSceneRef.current) {
      spineSceneRef.current.changeSkin(updatedCharacter);
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
