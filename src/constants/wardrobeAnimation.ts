import { SpineGameObject, Skin } from "@esotericsoftware/spine-phaser";
import { TypeWearLocation } from "../redux";
import { ICharacterResponse } from "../redux/api/character";

const proxyImageUrl = (url: string) => url.replace('https://storage.yandexcloud.net', '/api/miniapp-v2-dev');

const jsonUrl = new URL(`https://storage.yandexcloud.net/miniapp-v2-dev/anfas_happy.json`).href;
const atlasUrl = new URL(`https://storage.yandexcloud.net/miniapp-v2-dev/anfas_happyatlas.txt`).href;


export class WardrobeSpineScene extends Phaser.Scene {
  jsonUrl: string | undefined;
  atlasUrl: string | undefined;
  spineObject: SpineGameObject | null;
  constructor() {
    super({ key: 'player1' });
    this.spineObject = null;
  }

  preload() {
    this.load.spineJson('data', proxyImageUrl(jsonUrl));
    this.load.spineAtlas('atlas', proxyImageUrl(atlasUrl));
  }

  makeHappy() {
    if (!this.spineObject) return;
    this.spineObject.animationState.setAnimation(0, 'happy');
  }

  changeSkin(updatedCharacter?: ICharacterResponse) {
    if (!this.spineObject) return;
    const allSkins = this.spineObject.skeleton.data.skins;
    const headSkin = allSkins.find(item => item.name.includes(getSkin('head', updatedCharacter) ?? 'голова 18'))!
    const bottomSkin = allSkins.find(item => item.name.includes(getSkin('legs', updatedCharacter) ?? 'штаны базовые'))!;
    const upSkin = allSkins.find(item => item.name.includes(getSkin('upper_body', updatedCharacter) ?? 'футболка базовая'))!;
    
    const skin = new Skin('created');
    skin.addSkin(bottomSkin);
    skin.addSkin(upSkin);
    skin.addSkin(headSkin);


    this.spineObject.skeleton.setSkin(skin); 

    function getSkin(wear_location: TypeWearLocation, character?: ICharacterResponse) {
      return (updatedCharacter ?? character)?.skins
        .find(item => item.wear_location === wear_location)
        ?.name.toLowerCase();
    }
  }
}