import { SpineGameObject, Skin } from '@esotericsoftware/spine-phaser';
import { TypeWearLocation } from '../redux';
import { ICharacterResponse } from '../redux';
import { buildLink } from './buildMode';
const proxyImageUrl = buildLink()?.proxy!;

const jsonUrl = new URL(`${buildLink()?.itemBaseUrl}anfas_happy.json`).href;
const atlasUrl = new URL(`${buildLink()?.itemBaseUrl}anfas_happyatlas.txt`).href;

const dpi = window.devicePixelRatio;
export class WardrobeSpineScene extends Phaser.Scene {
  jsonUrl: string | undefined;
  atlasUrl: string | undefined;
  spineObject: SpineGameObject | null;
  timeout: NodeJS.Timeout | undefined;
  constructor() {
    super({ key: 'player1' });
    this.spineObject = null;
    this.timeout;
  }

  preload() {
    this.load.spineJson('data', proxyImageUrl(jsonUrl));
    this.load.spineAtlas('atlas', proxyImageUrl(atlasUrl));
    this.load.spineJson('data', jsonUrl);
    this.load.spineAtlas('atlas', atlasUrl);
  }

  makeHappy() {
    if (!this.spineObject) return;
    const currentHappy = this.spineObject.skeleton.skin?.name;
    this.spineObject.animationState.setAnimation(0, 'happy ' + currentHappy?.split('/')[1]);
  }

  createPerson(scale: number) {
    const width = this.sys.game.config.width as number * dpi;
    const center = width / 2;
    if (!this.add.spine) throw new Error('add.spine');
    this.spineObject = this.add.spine(center, center, 'data', 'atlas');
    this.spineObject.scale = scale;
    this.spineObject.animationState.data.defaultMix = 0.6;
  }

  changeSkin(scale: number, updatedCharacter?: ICharacterResponse) {
    if (!this.spineObject) return;
    const allSkins = this.spineObject.skeleton.data.skins;
    const headSkin = allSkins.find(item => item.name.includes(getSkin('head', updatedCharacter) ?? 'голова 18'))!;
    const bottomSkin = allSkins.find(item => item.name.includes(getSkin('legs', updatedCharacter) ?? 'штаны базовые'))!;
    const upSkin = allSkins.find(item =>
      item.name.includes(getSkin('upper_body', updatedCharacter) ?? 'футболка базовая'),
    )!;
    const face = allSkins.find(item => item.name.includes(getSkin('face', updatedCharacter) ?? 'лицо 1'))!;
    const skinColor = allSkins.find(item =>
      item.name.includes(getSkin('skin_color', updatedCharacter) ?? 'кожа базовая'),
    )!;

    const skin = new Skin('created');
    skin.name = face.name;
    bottomSkin && skin.addSkin(bottomSkin);
    upSkin && skin.addSkin(upSkin);
    headSkin && skin.addSkin(headSkin);
    face && skin.addSkin(face);
    skinColor && skin.addSkin(skinColor);
    this.spineObject.destroy();
    this.createPerson(scale);
    this.spineObject.skeleton.setSkin(skin);

    this.makeHappy();

    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.spineObject?.animationState.setAnimation(0, 'Idle', true), 4000);

    function getSkin(wear_location: TypeWearLocation, character?: ICharacterResponse) {
      return (updatedCharacter ?? character)?.skins
        .find(item => item.wear_location === wear_location)
        ?.name.toLowerCase();
    }
  }
}