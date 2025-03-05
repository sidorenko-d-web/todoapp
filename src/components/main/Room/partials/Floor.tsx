import { svgHeadersString } from '../../../../constants';
import { RoomItemsSlots, useGetEquipedQuery } from '../../../../redux';
import styles from './Partials.module.scss';

export const Floor = () => {
  const { data } = useGetEquipedQuery();

  const floor = data?.items.find(
    item => item.id === data.equipped_items.find(_item => _item.slot === RoomItemsSlots.floor.slot)?.id,
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
