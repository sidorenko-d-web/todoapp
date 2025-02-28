//@ts-ignore
import { SpineGameObject, SpinePlugin } from '@esotericsoftware/spine-phaser';
import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { useGetEquipedQuery } from '../../../../redux';
import { GameObjects } from 'phaser';

export const AnimationScene = () => {
  const proxyImageUrl = (url: string) => url.replace('https://storage.yandexcloud.net', '/api/miniapp-v2-dev');

  const { data: room } = useGetEquipedQuery();

  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);

  const [size, setSize] = useState([0, 0]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const width = sceneRef.current.offsetWidth;
    const center = width / 2;

    const itemsInSlots = {
      1: { width: 0, height: 0, x: -1000, y: -1000, z: -100 }, // walls === not here
      0: { width: 0, height: 0, x: -1000, y: -1000, z: -100 }, // floor === not here
      2: { width: 160, height: 160, x: -6, y: 455, z: 3 }, //desc
      3: { width: 120, height: 120, x: -50, y: 415, z: 2 }, //chair
      4: { width: 150, height: 150, x: 60, y: 320, z: 0 }, //sofa
      5: { width: 150, height: 150, x: -125, y: 260, z: 0 }, //window
      6: { width: 35, height: 35, x: -70, y: 223, z: 0 }, //poster
      7: { width: 35, height: 35, x: 100, y: 245, z: 0 }, //lens
      8: { width: 40, height: 40, x: 60, y: 228, z: 0 }, //note
      9: { width: 100, height: 100, x: 70, y: 210, z: 100 }, //light portable
      10: { width: 240, height: 240, x: -70, y: 390, z: -10 }, //carpet
      11: { width: 40, height: 40, x: 15, y: 425, z: 101 }, //camera
      12: { width: 140, height: 140, x: 90, y: 500, z: 99 }, //stand
      13: { width: 60, height: 60, x: 30, y: 398, z: 100 }, //lightDesc
      14: { width: 45, height: 45, x: -40, y: 427, z: 100 }, //mic
      15: { width: 40, height: 40, x: 35, y: 210, z: 1000 }, //photograph
      16: { width: 58, height: 58, x: -15, y: 444, z: 102 }, //pc
      17: { width: 17, height: 17, x: 15, y: 400, z: 100 }, //pen
      18: { width: 50, height: 50, x: 6, y: 188, z: 10 }, //lamp
      19: { width: 70, height: 70, x: -120, y: 485, z: 0 }, //ottoman
      20: { width: 60, height: 60, x: 145, y: 390, z: 0 }, //plant
    };

    const animated = [
      { animation: '2_idle', name: 'Постер', skin: () => 'default' },
      { animation: 'animation', name: 'Камера любительская', skin: (prem_lvl: string) => prem_lvl },
      { animation: 'animation', name: 'Камера профессиональная', skin: (prem_lvl: string) => prem_lvl },
      { animation: 'animation', name: 'Мыльница', skin: (prem_lvl: string) => prem_lvl },
      { animation: 'animation', name: 'Фикус', skin: (prem_lvl: string) => prem_lvl },
    ];

    const baseItems = [
      { name: 'broken-sofa', slot: 4, width: 140, height: 140, x: 60, y: 320, z: 0 },
      { name: 'chair', slot: 3, width: 46, height: 46, x: -48, y: 430, z: 0 },
      { name: 'table', slot: 2, width: 140, height: 140, x: -6, y: 455, z: 0 },
      { name: 'window', slot: 5, width: 110, height: 110, x: -125, y: 260, z: 0 },
    ];

    class SpineScene extends Phaser.Scene {
      jsonUrl: string | undefined;
      atlasUrl: string | undefined;
      spineObject: SpineGameObject | null;
      objects: (GameObjects.Image | SpineGameObject)[];
      constructor() {
        super({ key: 'player' });
        this.spineObject = null;
        this.objects = [];
      }

      preload() {
        if (!sceneRef.current) return;
        if (!gameRef.current) return;
        room?.items.forEach((item, i) => {
          if (animated.find(_item => item.name === _item.name)) {
            const jsonUrl = new URL(
              `https://storage.yandexcloud.net/miniapp-v2-dev/${item.name
                .toLowerCase()
                .replace(' ', '_')
                .replace('й', 'н')}_${item.item_premium_level}.json`,
            ).href;
            const atlasUrl = new URL(
              `https://storage.yandexcloud.net/miniapp-v2-dev/${item.name
                .toLowerCase()
                .replace(' ', '_')
                .replace('й', 'н')}_${item.item_premium_level}atlas.txt`,
            ).href;

            this.load.spineJson('json' + i, proxyImageUrl(jsonUrl));
            this.load.spineAtlas('atlas' + i, proxyImageUrl(atlasUrl));
          } else {
            const slot = room?.equipped_items.find(_item => _item.id === item.id)!.slot! as keyof typeof itemsInSlots;
            console.log(slot);
            const { width, height } = itemsInSlots[slot];
            this.load.svg('item' + i, proxyImageUrl(item.image_url!), { width, height });
          }
        });
        baseItems.forEach(item => {
          this.load.svg(
            item.name,
            proxyImageUrl('https://storage.yandexcloud.net/miniapp-v2-dev/' + item.name + '.svg'),
            { width: item.width, height: item.height },
          );
        });
      }

      create() {
        room?.items.forEach(async (item, i) => {
          const animatedItem = animated.find(_item => item.name === _item.name);
          console.log(animatedItem)
          if (animatedItem) {
            const slot = room?.equipped_items.find(_item => _item.id === item.id)!.slot! as keyof typeof itemsInSlots;
            const _item = itemsInSlots[slot];

            if (slot === 11 && room.equipped_items.find(item => item.slot === 12)) {
              this.objects?.push(this.add.spine(center + _item.x + 70, _item.y + 12, 'json' + i, 'atlas' + i));
            } else {
              this.objects?.push(this.add.spine(center + _item.x, _item.y, 'json' + i, 'atlas' + i));
            }

            this.objects[i].scale = _item.width / this.spine.getSkeletonData('json' + i, 'atlas' + i).width;
            //@ts-ignore
            // this.objects[i]?.animationState?.setAnimation(0, animatedItem.animation, true);
            //@ts-ignore
            this.objects[i]?.skeleton.setSkinByName(animatedItem.skin(item.item_premium_level));
            this.objects[i]?.setDepth(_item.z);
            console.log(this.objects[i])
          } else {
            const slot = room?.equipped_items.find(_item => _item.id === item.id)!.slot! as keyof typeof itemsInSlots;
            const _item = itemsInSlots[slot];
            this.objects?.push(this.add.image(center + _item.x, _item.y, 'item' + i));
            this.objects[i]?.setDepth(_item.z);
          }
        });
        const slots = room?.equipped_items.map(item => item.slot);

        baseItems.forEach(item => {
          if (!slots?.includes(item.slot)) {
            const added = this.add.image(center + item.x, item.y, item.name);
            added.setDepth(item.z);
            this.objects?.push(added);
          }
        });
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: width,
      height: sceneRef.current.offsetHeight,
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
  }, [sceneRef, size]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    // <div onClick={() => navigate('/dev-modals')} ref={sceneRef} id="player" style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1000 }}></div>
    <div ref={sceneRef} id="player" style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1000 }}></div>
  );
};
