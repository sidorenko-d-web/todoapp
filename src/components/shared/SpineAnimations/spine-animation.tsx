import { FC, useEffect, useRef } from 'react';
import { IShopItem } from '../../../redux';
import { SpineGameObject, SpinePlugin } from '@esotericsoftware/spine-phaser';

interface Props {
  item?: IShopItem;
}


const jsonUrl = new URL(`https://storage.yandexcloud.net/miniapp-v2-prod/постер_base.json`).href;
const atlasUrl = new URL(`https://storage.yandexcloud.net/miniapp-v2-prod/постер_baseatlas.txt`).href;

const SpineAnimation: FC<Props> = ({ item }) => {
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
        this.load.spineJson('data', (jsonUrl));
        this.load.spineAtlas('atlas', (atlasUrl));
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

  return <div id={'player'} style={{ position: 'absolute', borderRadius: 8, overflow: 'hidden' }} />;
};

export default SpineAnimation;
