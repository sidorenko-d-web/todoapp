//@ts-ignore
import { SpineGameObject, SpinePlugin } from '@esotericsoftware/spine-phaser';
import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import {
  IShopItem,
  selectIsNeedToPlayHappy,
  selectIsWorking,
  setNeedToPlayHappy,
  useGetEquipedQuery,
} from '../../../../redux';
import { SpineSceneBase, animated } from '../../../../constants';
import { useDispatch, useSelector } from 'react-redux';

export const AnimationScene = () => {
  const { data: room } = useGetEquipedQuery();

  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const spineSceneRef = useRef<SpineSceneBase | null>(null);

  const [size, setSize] = useState([0, 0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const isWorking = useSelector(selectIsWorking);
  const isNeedToPlayHappy = useSelector(selectIsNeedToPlayHappy);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    const width = sceneRef.current.offsetWidth;
    const contextProps = { equipped_items: room?.equipped_items, center: width / 2 };

    class SpineScene extends SpineSceneBase {
      preload() {
        if (!(sceneRef.current && gameRef.current)) return;

        this.loadPerson();

        //devided loading items of animated and static
        room?.items.forEach(item => {
          if (findAnimatedItem(item)) {
            this.loadAnimatedItem(item);
          } else {
            this.loadSvgItem(item, contextProps);
          }
        });

        this.loadBaseItems();
      }

      create() {
        this.createPerson(contextProps);

        //devided creating items of animated and static
        room?.items.forEach(async (item, i) => {
          const animatedItem = findAnimatedItem(item);
          if (animatedItem) {
            this.createAnimatedItem(item, i, animatedItem, contextProps);
          } else {
            this.createSVGItem(item, i, contextProps);
          }

          this.createBaseItems(contextProps);
        });

        spineSceneRef.current = this;
        setIsLoaded(true);
      }
    }

    const findAnimatedItem = (item: IShopItem) => {
      let animatedItem = animated.find(_item => item.name === _item.name);
      if (!animatedItem) animatedItem = animated.find(_item => item.name + item.item_premium_level === _item.name);
      return animatedItem;
    };

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

  useEffect(() => {
    if (!spineSceneRef.current) return;
    console.log('isWorking', isWorking);
    if (isWorking) spineSceneRef.current?.setWorking();
    else spineSceneRef.current?.setIdle();
  }, [isWorking, spineSceneRef.current, isLoaded]);

  useEffect(() => {
    if (!spineSceneRef.current) return;
    if (isNeedToPlayHappy) {
      spineSceneRef.current?.setHappy();
      setTimeout(() => {
        dispatch(setNeedToPlayHappy(false));
        if (isNeedToPlayHappy) spineSceneRef.current?.setIdle();
      }, 4000);
    }
  }, [isNeedToPlayHappy, spineSceneRef.current, isLoaded]);

  return (
    <>
      <div
        ref={sceneRef}
        id="player"
        style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1000 }}
      ></div>
    </>
  );
};
