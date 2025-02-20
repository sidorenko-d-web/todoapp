import { SpineGameObject, SpinePlugin } from '@esotericsoftware/spine-phaser';
import { useRef, useEffect } from 'react';
import { useGetEquipedQuery } from '../../../../redux';

export const AnimationScene = () => {
  // const proxyImageUrl = (url: string) => url.replace('https://storage.yandexcloud.net', '/api/miniapp-v2-dev');

  // const jsonUrl = new URL(`https://storage.yandexcloud.net/miniapp-v2-dev/постер_base.json`).href;
  // const atlasUrl = new URL(`https://storage.yandexcloud.net/miniapp-v2-dev/постер_baseatlas.txt`).href;

  const { data: room } = useGetEquipedQuery();
  console.log(room?.equipped_items);

  const gameRef = useRef<Phaser.Game | null>(null);

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
        room?.equipped_items.forEach(item => {

          this.load.spineJson('data', );
          this.load.spineAtlas('atlas', );
        })
      }

      create() {
        this.spineObject = this.add.spine(30, 30, 'data', 'atlas');
        this.spineObject.scale = 30 / this.spine.getSkeletonData('data', 'atlas').width;
        const s = this.spineObject.animationState.data.skeletonData.skins;
        this.spineObject.skeleton.setSkinByName(
          s.find(_item => _item.name === (item?.item_premium_level ?? 'base'))?.name ?? 'default',
        );
        const animations = this.spineObject.animationState.data.skeletonData.animations;
        this.spineObject.animationState.setAnimation(0, animations[animations.length - 1].name, true);
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 60,
      height: 60,
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
  }, []);

  return <div></div>;
};
