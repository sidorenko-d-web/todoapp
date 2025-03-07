import { SpineGameObject } from '@esotericsoftware/spine-phaser';
import { GameObjects } from 'phaser';
import { IRoomItem, IShopItem } from '../redux';
import Phaser from 'phaser';

export const itemsInSlots = {
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
  11: { width: 40, height: 40, x: 22, y: 420, z: 101 }, //camera
  12: { width: 140, height: 140, x: 90, y: 500, z: 99 }, //stand
  13: { width: 60, height: 60, x: 30, y: 398, z: 100 }, //lightDesc
  14: { width: 45, height: 45, x: -60, y: 420, z: 100 }, //mic
  15: { width: 40, height: 40, x: 35, y: 210, z: 1000 }, //photograph
  16: { width: 58, height: 58, x: -17, y: 443, z: 102 }, //pc
  17: { width: 17, height: 17, x: 15, y: 400, z: 100 }, //pen
  18: { width: 50, height: 50, x: 2, y: 187, z: 10 }, //lamp
  19: { width: 70, height: 70, x: -120, y: 485, z: 0 }, //ottoman
  20: { width: 60, height: 60, x: 145, y: 390, z: 0 }, //plant
};

export const animated = [
  { animation: '2_idle', name: 'Постерbase', skin: () => 'default', width: 35, x: -70, y: 223 },
  { animation: 'animation', name: 'Постерadvanced', skin: () => 'default', width: 190, x: -70, y: 223 },
  { animation: 'anim_2', name: 'Постерpro', skin: () => 'default', width: 37, x: -70, y: 223 },
  {
    animation: 'animation',
    name: 'Камера любительская',
    skin: (prem_lvl: string) => prem_lvl,
    width: 40,
    x: 22,
    y: 420,
  },
  {
    animation: 'animation',
    name: 'Камера профессиональная',
    skin: (prem_lvl: string) => prem_lvl,
    width: 65,
    x: 22,
    y: 420,
  },
  { animation: 'animation', name: 'Мыльница', skin: (prem_lvl: string) => prem_lvl, width: 40, x: 35, y: 210 },
  { animation: 'animation', name: 'Фотоаппарат', skin: (prem_lvl: string) => prem_lvl, width: 30, x: 35, y: 210 },
  { animation: 'animation', name: 'Фикус', skin: (prem_lvl: string) => prem_lvl, width: 60, x: 145, y: 390 },
  {
    animation: '4_blink_2',
    name: 'Лампа настольная',
    skin: (prem_lvl: string) => prem_lvl,
    width: 60,
    x: 30,
    y: 398,
  },
  { animation: 'blink_2', name: 'Лампа', skin: (prem_lvl: string) => prem_lvl, width: 110, x: 2, y: 187 },
  { animation: 'animation', name: 'ПКbase', skin: (prem_lvl: string) => prem_lvl, width: 100, x: -27, y: 425 },
  { animation: 'animation', name: 'ПКadvanced', skin: (prem_lvl: string) => prem_lvl, width: 100, x: -27, y: 425 },
  { animation: 'animation', name: 'ПК', skin: (prem_lvl: string) => prem_lvl, width: 100, x: -27, y: 425 },
  { animation: '2_idle', name: 'Ноутбук', skin: (prem_lvl: string) => prem_lvl, width: 52, x: -15, y: 439 },
];

export const baseItems = [
  { name: 'broken-sofa', slot: 4, width: 140, height: 140, x: 60, y: 320, z: 0 },
  { name: 'chair', slot: 3, width: 46, height: 46, x: -48, y: 430, z: 2 },
  { name: 'table', slot: 2, width: 140, height: 140, x: -6, y: 455, z: 3 },
  { name: 'window', slot: 5, width: 110, height: 110, x: -125, y: 260, z: 0 },
];

export const itemsBaseUrl = 'https://storage.yandexcloud.net/miniapp-v2-dev/';
interface contextProps {
  equipped_items?: IRoomItem[];
  center: number;
}

export class SpineSceneBase extends Phaser.Scene {
  jsonUrl: string | undefined;
  atlasUrl: string | undefined;
  person: SpineGameObject | null;
  objects: (GameObjects.Image | SpineGameObject)[];
  constructor() {
    super({ key: 'player' });
    this.person = null;
    this.objects = [];
  }

  //helpers for scene loading
  loadPerson() {
    this.load.spineJson('personJson', createLink('pers_izometria', 'json'));
    this.load.spineAtlas('personAtlas', createLink('pers_izometria', 'atlas'));
  }

  loadAnimatedItem(item: IShopItem) {
    const name = (item.name === 'ПК' ? 'Компьютер' : item.name).toLowerCase().replace(' ', '_').replace('й', 'н');

    this.load.spineJson('json' + item.id, createLink(`${name}_${item.item_premium_level}`, 'json'));
    this.load.spineAtlas('atlas' + item.id, createLink(`${name}_${item.item_premium_level}`, 'atlas'));
  }

  loadSvgItem(item: IShopItem, { equipped_items }: Pick<contextProps, 'equipped_items'>) {
    const slot = equipped_items?.find(_item => _item.id === item.id)!.slot! as keyof typeof itemsInSlots;
    const { width, height } = itemsInSlots[slot];
    this.load.svg('item' + item.id, proxyImageUrl(item.image_url!), { width, height });
  }

  loadBaseItems() {
    baseItems.forEach(item => {
      this.load.svg(item.name, createLink(item.name, 'base'), { width: item.width, height: item.height });
    });
  }

  //helpers for scene creation
  createPerson({ center }: Pick<contextProps, 'center'>, isWorking: boolean) {
    console.log('creation')
    this.person = this.add.spine(center - 40, 385, 'personJson', 'personAtlas');
    this.person.scale = 0.07;
    this.person.setDepth(3);
    this.person.animationState.data.defaultMix = 0.1;
    this.setCurrentLoopedAnimation(isWorking);

  }

  createAnimatedItem(
    item: IShopItem,
    i: number,
    animatedItem: (typeof animated)[0],
    { equipped_items, center }: contextProps,
  ) {
    const slot = equipped_items?.find(_item => _item.id === item.id)!.slot! as keyof typeof itemsInSlots;
    const _item = itemsInSlots[slot];

    //changing position for camera if there is stand in the room
    if (slot === 11 && equipped_items?.find(item => item.slot === 12)) {
      this.objects?.push(
        this.add.spine(center + animatedItem.x + 65, animatedItem.y + 17, 'json' + item.id, 'atlas' + item.id),
      );
    } else {
      this.objects?.push(this.add.spine(center + animatedItem.x, animatedItem.y, 'json' + item.id, 'atlas' + item.id));
    }

    this.objects[i].scale = animatedItem.width / this.spine.getSkeletonData('json' + item.id, 'atlas' + item.id).width;
    //@ts-ignore
    this.objects[i]?.animationState?.setAnimation(0, animatedItem.animation, true);
    //@ts-ignore
    this.objects[i]?.skeleton.setSkinByName(animatedItem.skin(item.item_premium_level));
    this.objects[i]?.setDepth(_item.z);
  }

  createSVGItem(item: IShopItem, i: number, { equipped_items, center }: contextProps) {
    const slot = equipped_items?.find(_item => _item.id === item.id)!.slot! as keyof typeof itemsInSlots;
    const _item = itemsInSlots[slot];
    this.objects?.push(this.add.image(center + _item.x, _item.y, 'item' + item.id));
    this.objects[i]?.setDepth(_item.z);
  }

  createBaseItems({ equipped_items, center }: contextProps) {
    const slots = equipped_items?.map(item => item.slot);
    baseItems.forEach(item => {
      if (!slots?.includes(item.slot)) {
        const added = this.add.image(center + item.x, item.y, item.name);
        added.setDepth(item.z);
        this.objects?.push(added);
      }
    });
  }

  setCurrentLoopedAnimation(isWorking: Boolean) {
    console.log('isWorking', isWorking);
    if (isWorking) this.setWorking();
    else this.setIdle();
  }

  //animation state setters
  setWorking() {
    if (!this.person) return;
    this.person?.animationState.setAnimation(0, PersonAnimations.work, true);
  }
  setHappy() {
    if (!this.person) return;
    this.person?.animationState.setAnimation(0, PersonAnimations.happy + this.person.skeleton.skin?.name);
  }
  setIdle() {
    if (!this.person) return;
    this.person?.animationState.setAnimation(0, PersonAnimations.idle, true);
  }
}

const proxyImageUrl = (url: string) => url.replace('https://storage.yandexcloud.net', '/api/miniapp-v2-dev');

const createLink = (itemString: string, type: 'json' | 'atlas' | 'base') => {
  let string: string = '';
  if (type === 'json') string = new URL(itemsBaseUrl + itemString + '1.json').href;
  if (type === 'atlas') string = new URL(itemsBaseUrl + itemString + 'atlas1.txt').href;
  if (type === 'base') string = new URL(itemsBaseUrl + itemString + '.svg').href;
  return proxyImageUrl(string);
};

export enum PersonAnimations {
  idle = '2 idle (основа)',
  work = '3 work',
  happy = '4 happy ',
}
