import { IEquipedRoomResponse } from '../../../../redux';
import styles from './Partials.module.scss';
import { RoomItemsSlots } from '../../../../../translate/items/items.ts';

import redbase from '../../../../assets/images/walls/Пол-1.svg';
import redadv from '../../../../assets/images/walls/Пол-2.svg';
import redpro from '../../../../assets/images/walls/Пол-3.svg';

import yellowbase from '../../../../assets/images/walls/Ламинат-1.svg';
import yellowadv from '../../../../assets/images/walls/Ламинат-2.svg';
import yellowpro from '../../../../assets/images/walls/Ламинат-3.svg';

import greenbase from '../../../../assets/images/walls/Плитка-1.svg';
import greenadv from '../../../../assets/images/walls/Плитка-2.svg';
import greenpro from '../../../../assets/images/walls/Плитка-3.svg';

interface props {
  room: IEquipedRoomResponse | undefined;
}

export const Floor = ({ room }: props) => {

  const equipedFloor = room?.items.find(
    item => item.id === room.equipped_items.find(_item => _item.slot === RoomItemsSlots.floor.slot)?.id,
  );

  const floors = {
    redbase,
    redadv,
    redpro,
    yellowbase,
    yellowadv,
    yellowpro,
    greenbase,
    greenadv,
    greenpro,
  };

  console.log(equipedFloor);

  const floor =  equipedFloor
  ? `url("${floors[(equipedFloor.item_rarity + equipedFloor.item_premium_level) as keyof typeof floors]}")`
  : 'gray'

  // const floor = `url("${floors.yellowpro}")`;
  return (
    <>
      <div
        className={styles.floorWrapper}
        style={{
          background: floor,
        }}
      >
        {/* <div className={styles.floor}>
          {equipedFloor && (
            <img
              src={floor[(equipedFloor.item_rarity + equipedFloor.item_premium_level) as keyof typeof floor]}
              alt="floor"
            />
          )}
        </div> */}
      </div>
    </>
  );
};
