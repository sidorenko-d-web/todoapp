import { SpineGameObject } from '@esotericsoftware/spine-phaser';
import Phaser, { GameObjects } from 'phaser';
import { IRoomItem, IShopItem } from '../redux';
import { buildLink } from './buildMode';

export const itemsInSlots = {
  1: { width: 0, height: 0, x: -1000, y: -1000, z: -100 }, // walls === not here
  0: { width: 0, height: 0, x: -1000, y: -1000, z: -100 }, // floor === not here
  2: { width: 160, height: 160, x: -6, y: 451, z: 3 }, //desc
  3: { width: 120, height: 120, x: -45, y: 415, z: 2 }, //chair
  4: { width: 150, height: 150, x: 60, y: 320, z: 0 }, //sofa
  5: { width: 150, height: 150, x: -135, y: 260, z: 0 }, //window
  6: { width: 35, height: 35, x: -60, y: 203, z: 0 }, //poster
  7: { width: 35, height: 35, x: 107, y: 243, z: 0 }, //lens
  8: { width: 40, height: 40, x: 60, y: 228, z: 0 }, //note
  9: { width: 100, height: 100, x: 80, y: 205, z: 100 }, //light portable
  10: { width: 240, height: 240, x: -70, y: 390, z: -10 }, //carpet
  11: { width: 60, height: 60, x: 22, y: 420, z: 101 }, //camera
  12: { width: 140, height: 140, x: 95, y: 500, z: 99 }, //stand
  13: { width: 100, height: 100, x: 17, y: 375, z: 100 }, //lightDesc
  14: { width: 45, height: 45, x: -58, y: 413, z: 100 }, //mic
  15: { width: 40, height: 40, x: 35, y: 210, z: 1000 }, //photograph
  16: { width: 58, height: 58, x: -17, y: 438, z: 102 }, //pc
  17: { width: 17, height: 17, x: 15, y: 392, z: 100 }, //pen
  18: { width: 50, height: 50, x: 2, y: 187, z: 10 }, //lamp
  19: { width: 70, height: 70, x: -120, y: 485, z: 0 }, //ottoman
  20: { width: 60, height: 60, x: 135, y: 365, z: 100 }, //plant
};

export const animated = [
  { animation: '2_idle', name: 'Постерbase', skin: () => 'default', width: 40, x: -70, y: 213 },
  { animation: 'animation', name: 'Постерadvanced', skin: () => 'default', width: 190, x: -70, y: 223 },
  { animation: 'anim_2', name: 'Постерpro', skin: () => 'default', width: 40, x: -70, y: 213 },
  {
    animation: 'animation',
    name: 'Камера любительская',
    skin: (prem_lvl: string) => prem_lvl,
    width: 40,
    x: 22,
    y: 415,
  },
  {
    animation: 'animation',
    name: 'Камера профессиональная',
    skin: (prem_lvl: string) => prem_lvl,
    width: 55,
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
    x: 32,
    y: 394,
  },
  { animation: 'blink_2', name: 'Лампа', skin: (prem_lvl: string) => prem_lvl, width: 110, x: 2, y: 187 },
  { animation: 'animation', name: 'ПКbase', skin: (prem_lvl: string) => prem_lvl, width: 100, x: -27, y: 425 },
  { animation: 'animation', name: 'ПКadvanced', skin: (prem_lvl: string) => prem_lvl, width: 100, x: -27, y: 425 },
  { animation: 'pro', name: 'ПКpro', skin: (prem_lvl: string) => prem_lvl, width: 120, x: -16, y: 420 },
  { animation: '2_idle', name: 'Ноутбук', skin: (prem_lvl: string) => prem_lvl, width: 52, x: -15, y: 433 },
];

export const baseItems = [
  { name: 'broken-sofa', slot: 4, width: 150, height: 150, x: 60, y: 320, z: 0 },
  { name: 'chair', slot: 3, width: 46, height: 46, x: -52, y: 422, z: 2 },
  { name: 'table', slot: 2, width: 150, height: 150, x: -6, y: 442, z: 3 },
  { name: 'window', slot: 5, width: 140, height: 140, x: -125, y: 260, z: 0 },
  { name: 'vase', slot: 19, width: 70, height: 70, x: -120, y: 485, z: 0 },
];

const proxyImageUrl = buildLink()?.proxy!;
const dpi = window.devicePixelRatio;

export const itemsBaseUrl = buildLink()?.itemBaseUrl;

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

    if ('Постер в рамке' === item.name) {
      this.load.svg('item' + item.id, createLink(`${item.name}${item.item_premium_level}`, 'base'), {
        width: (width + 50) * dpi,
        height: (height + 50) * dpi,
      });
    } else if ('Картина LED' === item.name) {
      this.load.svg('item' + item.id, createLink(`Картины LED${item.item_premium_level}`, 'base'), {
        width: (width + 50) * dpi,
        height: (height + 50) * dpi,
      });
    } else if (item.name === 'Кресло') {
      this.load.svg('item' + item.id, buildLink()?.svgLink(item.image_url), {
        width: (width + 80) * dpi,
        height: (height + 80) * dpi,
      });
    } else if (item.name === 'Стол массив') {
      this.load.svg('item' + item.id, buildLink()?.svgLink(item.image_url), {
        width: (width + 20) * dpi,
        height: (height + 20) * dpi,
      });
    } else {
      this.load.svg('item' + item.id, buildLink()?.svgLink(item.image_url), {
        width: width * dpi,
        height: height * dpi,
      });
    }
  }

  loadBaseItems() {
    baseItems.forEach(item => {
      this.load.image(item.name, createLink(item.name, 'base'));
    });
  }

  //helpers for scene creation
  createPerson({ center }: Pick<contextProps, 'center'>, isWorking: boolean) {
    if (!this.add.spine) throw new Error('add.spine');
    this.person = this.add.spine(center - 40 * dpi, 437 * dpi, 'personJson', 'personAtlas');
    this.person.scale = 0.07 * dpi;
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
    const x =
      (slot === 11 && equipped_items?.find(item => item.slot === 12) ? animatedItem.x + 65 : animatedItem.x) * dpi;
    const y =
      (slot === 11 && equipped_items?.find(item => item.slot === 12) ? animatedItem.y + 20 + 50 : animatedItem.y + 50) *
      dpi;

    const spineObject = this.add.spine(center + x, y, 'json' + item.id, 'atlas' + item.id);
    spineObject.scale =
      (animatedItem.width / this.spine.getSkeletonData('json' + item.id, 'atlas' + item.id).width) * dpi;
    spineObject.animationState.setAnimation(0, animatedItem.animation, true);
    spineObject.skeleton.setSkinByName(animatedItem.skin(item.item_premium_level));
    spineObject.setDepth(_item.z);

    this.objects[i] = spineObject;
  }

  createSVGItem(item: IShopItem, i: number, { equipped_items, center }: contextProps) {
    const slot = equipped_items?.find(_item => _item.id === item.id)!.slot! as keyof typeof itemsInSlots;
    const _item = itemsInSlots[slot];
    let imageObject;
    if (item.name === 'Кинокамера' && equipped_items?.find(item => item.slot === 12)) {
      imageObject = this.add.image(center + (_item.x + 65) * dpi, (_item.y + 50) * dpi, 'item' + item.id);
    } else if (item.name === 'Штатив регулируемый') {
      imageObject = this.add.image(center + _item.x * dpi, (_item.y + 50 - 15) * dpi, 'item' + item.id);
    } else if (item.name === 'Кинокамера' && equipped_items?.find(item => item.slot === 12)) {
      imageObject = this.add.image(center + (_item.x + 65) * dpi, (_item.y + 50 + 5) * dpi, 'item' + item.id);
    } else if (item.name === 'Лампа кольцевая' && equipped_items?.find(item => item.slot === 12)) {
      imageObject = this.add.image(center + (_item.x + 23) * dpi, (_item.y + 50 - 10) * dpi, 'item' + item.id);
      imageObject.scale = 1.2;
    } else if (item.name === 'ПК' && equipped_items?.find(item => item.slot === 12)) {
      imageObject = this.add.image(center + (_item.x + 10) * dpi, (_item.y + 50 - 10) * dpi, 'item' + item.id);
    } else if (item.name === 'Кресло' && equipped_items?.find(item => item.slot === 12)) {
      imageObject = this.add.image(center + (_item.x - 30) * dpi, (_item.y + 50) * dpi, 'item' + item.id);
    } else {
      imageObject = this.add.image(center + _item.x * dpi, (_item.y + 50) * dpi, 'item' + item.id);
    }
    imageObject.setDepth(_item.z);
    this.objects[i] = imageObject;
  }

  createBaseItems({ equipped_items, center }: contextProps) {
    const slots = equipped_items?.map(item => item.slot);
    baseItems.forEach(item => {
      if (!slots?.includes(item.slot)) {
        const added = this.add.image(center + item.x * dpi, (item.y + 50) * dpi, item.name);
        added.setDepth(item.z);
        added.displayWidth = item.width * dpi;
        added.displayHeight = item.height * dpi;
        this.objects?.push(added);
      }
    });
  }

  setCurrentLoopedAnimation(isWorking: boolean) {
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

const createLink = (itemString: string, type: 'json' | 'atlas' | 'json1' | 'atlas1' | 'base' | 'png') => {
  let string: string = '';
  if (type === 'json') string = new URL(itemsBaseUrl + itemString + '.json').href;
  else if (type === 'atlas') string = new URL(itemsBaseUrl + itemString + 'atlas.txt').href;
  else if (type === 'json1') string = new URL(itemsBaseUrl + itemString + '1.json').href;
  else if (type === 'atlas1') string = new URL(itemsBaseUrl + itemString + 'atlas1.txt').href;
  else if (type === 'base') string = new URL(itemsBaseUrl + itemString + '.svg').href;
  else if (type === 'png') string = new URL(itemsBaseUrl + itemString + '.png').href;

  return proxyImageUrl(string);
};

export enum PersonAnimations {
  idle = '2 idle (основа)',
  work = '3 work',
  happy = '4 happy ',
}
