import { Skin, SpinePlugin } from '@esotericsoftware/spine-phaser';
import { Dispatch, SetStateAction, memo, useEffect, useRef, useState } from 'react';
import {
  IEquipedRoomResponse,
  IShopItem,
  selectIsNeedToPlayHappy,
  selectIsWorking,
  setAnimationSceneLoaded,
  setNeedToPlayHappy,
  TypeWearLocation,
} from '../../../../redux';
import { animated, SpineSceneBase } from '../../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { ICharacterResponse } from '../../../../redux/api/character';

interface props {
  room: IEquipedRoomResponse | undefined;
  character?: { data?: ICharacterResponse; isLoading: boolean };
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
}

export const AnimationScene = memo(({ room, character, setIsLoaded }: props) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const spineSceneRef = useRef<SpineSceneBase | null>(null);

  const [size, setSize] = useState([0, 0]);
  const isWorking = useSelector(selectIsWorking);
  const isNeedToPlayHappy = useSelector(selectIsNeedToPlayHappy);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoaded(false);

    if (!sceneRef.current || character?.isLoading) return;
    const width = sceneRef.current.offsetWidth;
    const contextProps = { equipped_items: room?.equipped_items, center: width / 2 };

    class SpineScene extends SpineSceneBase {
      preload() {
        if (!(sceneRef.current && gameRef.current)) return;

        this.loadPerson();

        // Разделение загрузки анимированных и статичных предметов
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
        try {
          this.createPerson(contextProps, isWorking);
        } catch (error: any) {
          if (error.message === 'add.spine') {
            setSize(prev => [prev[0] + 1, prev[1]]);
          }
        }

        // Разделение создания анимированных и статичных предметов
        room?.items.forEach(async (item, i) => {
          const animatedItem = findAnimatedItem(item);
          if (animatedItem) {
            this.createAnimatedItem(item, i, animatedItem, contextProps);
          } else {
            this.createSVGItem(item, i, contextProps);
          }
        });

        this.createBaseItems(contextProps);

        spineSceneRef.current = this;
        this.changeSkin();
        setIsLoaded(true);
        dispatch(setAnimationSceneLoaded(true));
      }

      changeSkin(updatedCharacter?: ICharacterResponse) {
        if (!this.person) return;
        const allSkins = this.person.skeleton.data.skins;
        const face = allSkins.find(item => item.name.includes(getSkin('face') ?? 'лицо 1'))!;
        const headSkin = allSkins.find(item => item.name.includes(getSkin('head') ?? 'голова 18'))!;
        const bottomSkin = allSkins.find(item => item.name.includes(getSkin('legs') ?? 'штаны базовые'))!;
        const skinColor = allSkins.find(item => item.name.includes(getSkin('skin_color') ?? 'кожа базовая'))!;
        const upSkin = allSkins.find(item => item.name.includes(getSkin('upper_body') ?? 'футболка_базовая'))!;

        const skin = new Skin('created');
        skin.name = face.name.split('/')[1];
        skin.addSkin(bottomSkin);
        skin.addSkin(upSkin);
        skin.addSkin(headSkin);
        skin.addSkin(face);
        skin.addSkin(skinColor);

        this.person.skeleton.setSkin(skin);

        function getSkin(wear_location: TypeWearLocation) {
          return (updatedCharacter ?? character?.data)?.skins
            .find(item => item.wear_location === wear_location)
            ?.name.toLowerCase();
        }
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
        console.log('destroy');
        gameRef.current.destroy(true);
        gameRef.current = null;
        spineSceneRef.current = null;
      }
    };
  }, [sceneRef, size, character?.isLoading]);

  useEffect(() => {
    if (!spineSceneRef.current) return;
    spineSceneRef.current?.setCurrentLoopedAnimation(isWorking);
  }, [isWorking, spineSceneRef.current, size]);

  useEffect(() => {
    if (!spineSceneRef.current) return;
    if (isNeedToPlayHappy) {
      spineSceneRef.current?.setHappy();
      setTimeout(() => {
        dispatch(setNeedToPlayHappy(false));
        if (isNeedToPlayHappy) spineSceneRef.current?.setIdle();
      }, 4000);
    }
  }, [isNeedToPlayHappy, spineSceneRef.current]);

  return (
    <>
      <div
        ref={sceneRef}
        id="player"
        style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1000 }}
      ></div>
    </>
  );
});
