import { SpineGameObject, SpinePlugin } from '@esotericsoftware/spine-phaser';
import { useRef, useEffect } from 'react';

export default function DevModals() {
  const proxyImageUrl = (url: string) => url.replace('https://storage.yandexcloud.net', '/api/miniapp-v2-dev');

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

        this.load.spineJson('json', proxyImageUrl(jsonUrl));
        this.load.spineAtlas('atlas', proxyImageUrl(atlasUrl));
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

  return <div ref={sceneRef} id="player" style={{ width: '100%', height: '100%', marginTop: 100 }}></div>;
}
