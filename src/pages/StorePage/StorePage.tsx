import { FC, useState } from 'react';
import styles from './StorePage.module.scss';
import StoreCard from '../../components/store/StoreCard/StoreCard';
import TabsNavigation from '../../components/TabsNavigation/TabsNavigation';

const tabs1 = ['Текст', 'Фото', 'Видео', 'Декор', 'Вы'];
const tabs2 = ['Эконом', 'Премиум', 'Люкс'];

const StorePage: FC = () => {
  const [currentTab1, setCurrentTab1] = useState(tabs1[0]);
  const [currentTab2, setCurrentTab2] = useState(tabs2[0]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Магазин</h1>

        <div className={styles.scores}>
          <div className={styles.scoresItem}>
            <p>+100</p>
            <img src="/img/subscriber_coin.svg" />
            <p>/сек.</p>
          </div>
          <div className={styles.scoresItem}>
            <p>+100</p>
            <img src="/img/coin.svg" />
            <p>/сек.</p>
          </div>
        </div>
      </div>

      <div className={styles.navs}>
        <TabsNavigation tabs={tabs1} currentTab={currentTab1} onChange={setCurrentTab1} />
        {currentTab1 !== 'Вы' && (
          <TabsNavigation
            colorClass={
              currentTab2 === 'Эконом'
                ? 'tabItemSelectedBlue'
                : currentTab2 === 'Премиум'
                ? 'tabItemSelectedPurple'
                : 'tabItemSelectedRed'
            }
            tabs={tabs2}
            currentTab={currentTab2}
            onChange={setCurrentTab2}
          />
        )}
      </div>

      {currentTab1 !== 'Вы' ? (
        <div className={styles.cardsWrapper}>
          {currentTab2 === 'Эконом' ? (
            <>
              <StoreCard />
              <StoreCard isUpgradeEnabled={false} />
              <StoreCard disabled />
              <StoreCard isBlocked />
            </>
          ) : currentTab2 === 'Премиум' ? (
            <>
              <StoreCard variant="vip" />
              <StoreCard variant="vip" isUpgradeEnabled={false} />
              <StoreCard variant="vip" disabled />
              <StoreCard variant="vip" isBlocked />
            </>
          ) : (
            <>
              <StoreCard variant="lux" />
              <StoreCard variant="lux" isUpgradeEnabled={false} />
              <StoreCard variant="lux" disabled />
              <StoreCard variant="lux" isBlocked />
            </>
          )}
        </div>
      ) : (
        <>
          <div className={styles.personCards}>
            <h2>Голова</h2>
            <StoreCard personType='head' />
            <StoreCard personType='head' />
          </div>
          <div className={styles.personCards}>
            <h2>Лицо</h2>
            <StoreCard personType='face' />
            <StoreCard personType='face' />
          </div>
        </>
      )}
    </div>
  );
};

export default StorePage;
