import { svgHeadersString } from '../../../../constants';
import { IEquipedRoomResponse } from '../../../../redux';
import styles from './Partials.module.scss';
import { useRoomItemsSlots } from '../../../../../translate/items/items.ts';

interface props {
  room: IEquipedRoomResponse | undefined;
}

export const Floor = ({ room }: props) => {
  const RoomItemsSlots = useRoomItemsSlots();
  const floor = room?.items.find(
    item => item.id === room.equipped_items.find(_item => _item.slot === RoomItemsSlots.floor.slot)?.id,
  );

  return (
    <>
      <div className={styles.floorWrapper}>
        <div className={styles.floor}>
          {floor?.item_rarity === 'red' && <img src={floor?.image_url + svgHeadersString} alt="floor" />}
        </div>
      </div>
    </>
  );
};
