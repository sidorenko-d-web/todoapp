import { SpineGameObject, SpinePlugin } from '@esotericsoftware/spine-phaser';
import { useRef, useEffect } from 'react';
import { useGetShopSkinsQuery } from '../../redux';
import { svgHeadersString } from '../../constants';

export default function DevModals() {

  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    class SpineScene extends Phaser.Scene {
      jsonUrl: string | undefined;
      atlasUrl: string | undefined;
      spineObject: SpineGameObject | null;
      constructor() {
        super({ key: 'player' });
        this.spineObject = null;
      }

      preload() {
        const jsonUrl = new URL(`https://storage.yandexcloud.net/miniapp-v2-dev/лампа_base.json`).href;
        const atlasUrl = new URL(`https://storage.yandexcloud.net/miniapp-v2-dev/лампа_baseatlas.txt`).href;

        this.load.spineJson('json', (jsonUrl));
        this.load.spineAtlas('atlas', (atlasUrl));
      }

      create() {
        this.spineObject = this.add.spine(100, 100, 'json', 'atlas');
        this.spineObject.scale = 0.1;
        this.spineObject.skeleton.setSkinByName('base');
        console.log(this.spineObject);
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 300,
      height: 300,
      backgroundColor: '#255',
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
  }, [sceneRef]);

  const { data: skins } = useGetShopSkinsQuery();
  console.log(skins);

  return (
    <div>
      {skins?.skins.map(item => (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 24, color: '#555'}}>
          {item.name} <img src={item.image_url + svgHeadersString} width={70} height={70}/>
        </div>
      ))}
    </div>
  );
}
