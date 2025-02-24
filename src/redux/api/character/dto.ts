import { IShopSkin } from '../shop';

export type TypeGender = 'male' | 'female';

export interface ICharacterResponse {
  id: string;
  profile_id: string;
  skins: IShopSkin[];
  gender: TypeGender;
}
export interface IUpdateCharacterRequest {
  head_skin_id?: string;
  face_skin_id?: string;
  upper_body_skin_id?: string;
  legs_skin_id?: string;
  skin_color_id?: string;
  vip_skin_id?: string;
  gender: TypeGender;
}
