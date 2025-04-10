import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import BottomModal from '../../../shared/BottomModal/BottomModal';

import s from './UserReferrals.module.scss';
import subscribersIcon from '../../../../assets/icons/subscribers.png';

import { ReferralCard } from '../../ReferralCard/ReferralCard';
import { ReferralDTO, useLazyGetCurrentUsersReferralsQuery } from '../../../../redux';
import { formatAbbreviation } from '../../../../helpers';
import { useTranslation } from 'react-i18next';
import { VariableSizeList } from 'react-window';

interface UserReferralsProps {
  modalId: string;
  onClose: () => void;
}

const LOAD_MORE_THRESHOLD = 5; // Загружать новые данные, когда до конца осталось 5 элементов
const INITIAL_LOAD_COUNT = 20; // Количество элементов для первоначальной загрузки

export const UserReferrals: React.FC<UserReferralsProps> = ({ modalId, onClose }: UserReferralsProps) => {
  const { t, i18n } = useTranslation('promotion');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const listRef = useRef<VariableSizeList>(null);
  const isLoaded = useRef(false);
  const [items, setItems] = useState<ReferralDTO[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [getReferrers, { data, isLoading, isFetching, error }] = useLazyGetCurrentUsersReferralsQuery();

  useEffect(() => {
    setItems([]);
    setTotalCount(0);
    loadMore(0, INITIAL_LOAD_COUNT);
    isLoaded.current = true;
  }, []);

  const loadMore = async (offset: number, limit: number) => {
    try {
      const { data } = await getReferrers({ offset, limit });
      if (data) {
        setItems(prev => [...prev, ...data.referrals]);
        setTotalCount(data.count);

        requestAnimationFrame(() => {
          if (listRef.current) {
            // Пересчитываем высоты для всех элементов после загруженного диапазона
            listRef.current.resetAfterIndex(offset);
          }
        });
      
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(data);

  const handleItemsRendered = ({ visibleStopIndex }: { visibleStopIndex: number }) => {
    console.log(items.length < totalCount);
    if (!isFetching && items.length < totalCount && visibleStopIndex > items.length - LOAD_MORE_THRESHOLD) {
      loadMore(items.length, INITIAL_LOAD_COUNT);
    }
  };

  const getItemSize = (index: number) => {
    const item = items?.[index]
    const gap = 10
    if (item?.push_line_data.failed_days_ago > 1 && item?.reminded_at === null) {
      return 153 + gap;
    }else if(item?.invited_count === 0 || item?.points_for_referrer === 0){
      return 97 + gap
    }
    return 129 + gap;
  };

  const Row = ({ index, data, style }: { index: number; data: ReferralDTO[]; style: CSSProperties }) => {
    const referrer = data?.[index];

    return (
      <div style={style} className={s.item}>
        {!referrer ? (
          <p className={s.loadingText}>{t('p70')}</p>
        ) : (
          <ReferralCard
            key={index}
            id_referral={data[index].id}
            position={index + 1}
            name={data[index].username}
            reminded_time={data[index].reminded_at}
            total_invited={data[index].invited_count}
            streak={data[index].push_line_data.in_streak_days}
            days_missed={data[index].push_line_data.failed_days_ago}
            points_for_referrer={data[index].points_for_referrer}
            subscribers_for_referrer={data[index].subscribers_for_referrer}
            isModal
          />
        )}
      </div>
    );
  };

  return (
    <BottomModal modalId={modalId} title={`${t('p32')}`} onClose={onClose}>
      <div className={s.badgesWrp} style={{ justifyContent: 'center' }}>
        <span className={s.badge}>
          <span>
            +{formatAbbreviation(data?.main_statistics.subscribers_from_first_level, 'number', { locale: locale })}
          </span>
          <img src={subscribersIcon} className={s.icon} alt="Подписчики"></img>
          <span className={s.level}>1{t('p4')}.</span>
        </span>
        <span className={s.badge}>
          <span className={s.value}>
            +{formatAbbreviation(data?.main_statistics.subscribers_from_second_level, 'number', { locale: locale })}
          </span>
          <img src={subscribersIcon} className={s.icon} alt="Подписчики"></img>
          <span className={s.level}>2{t('p4')}.</span>
        </span>
      </div>

      {isLoading && <p>{t('p34')}</p>}

      {error && <p>{t('p33')}</p>}

      {data && (
        <>
          <VariableSizeList
            ref={listRef}
            height={window.innerHeight * 0.6}
            width={window.innerWidth - 7}
            itemCount={totalCount}
            itemData={items}
            itemSize={getItemSize}
            onItemsRendered={handleItemsRendered}
            className={s.list}
          >
            {Row}
          </VariableSizeList>

          {data.count === 0 && <p className={s.noReferrals}>{t('p35')}</p>}
        </>
      )}
    </BottomModal>
  );
};
