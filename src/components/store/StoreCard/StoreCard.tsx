import { FC } from 'react';
import styles from './StoreCard.module.scss';
import clsx from 'clsx';
import LockIconSvg from '../../../assets/Icons/Lock_icon_svg';

interface Props {
  disabled?: boolean;
  isUpgradeEnabled?: boolean;
  isBlocked?: boolean;
  personType?: 'head' | 'face';

  variant?: 'lowcost' | 'vip' | 'lux';
}

const StoreCard: FC<Props> = ({ disabled, isBlocked, isUpgradeEnabled = true, variant = 'lowcost', personType }) => {
  return (
    <div className={styles.storeCard}>
      <div className={styles.header}>
        <div
          className={clsx(styles.image, variant === 'vip' ? styles.purpleImage : variant === 'lux' && styles.redImage)}
        >
          {!personType && <img src="/img/chair.svg" className={clsx(isBlocked && styles.disabledImage)} />}
          {isBlocked && <LockIconSvg className={styles.disabledImageIcon} />}
          {!personType && !isBlocked && <p>Base</p>}
        </div>
        <div className={styles.title}>
          <h3>Стул</h3>
          <p className={variant === 'lux' ? styles.colorRed : variant === 'vip' ? styles.colorPurple : styles.level}>
            Уровень 5
          </p>
          {!personType && (
            <div className={clsx(styles.stats, (isBlocked || disabled) && styles.disabledStats)}>
              <div className={styles.statsItem}>
                <p>+150</p>
                <img src="/img/coin.svg" />
              </div>
              <div className={styles.statsItem}>
                <p>+100</p>
                <img src="/img/subscriber_coin.svg" />
              </div>
              <div className={styles.statsItem}>
                <p>+5</p>
                <img src="/img/coin.svg" />
                <p>/сек</p>
              </div>
            </div>
          )}
        </div>

        {personType === 'head' ? (
          <img src="/img/face_icon.svg" className={styles.personIcon}/>
        ) : personType === 'face' ? (
          <img src="/img/face_icon.svg" className={styles.personIcon}/>
        ) : variant === 'lowcost' ? (
          <div className={styles.variant}>
            <p>Эконом</p>
          </div>
        ) : variant === 'vip' ? (
          <div className={styles.variantPurple}>
            <p>Премиум</p>
          </div>
        ) : (
          <div className={styles.variantRed}>
            <p>Люкс</p>
          </div>
        )}
      </div>

      {!personType &&
        !isBlocked &&
        (disabled ? (
          <p className={styles.disabledText}>
            Сейчас активен “
            <span className={variant === 'vip' ? styles.itemNameBlue : styles.itemNamePurple}>
              Компьютерный стул - Base
            </span>
            ”. Вы можете заменить его на текущий предмет, сделав его активным.
          </p>
        ) : (
          <div className={styles.progress}>
            <div className={styles.text}>
              <p>5/50 уровней </p>
              <div className={styles.goal}>
                <p>Каменный сундук</p>
                <img src="/img/blue_chest.svg" />
              </div>
            </div>

            <div className={styles.progressBar}>
              <div
                className={variant === 'lowcost' ? styles.done : variant === 'vip' ? styles.donePurple : styles.doneRed}
                style={{ width: 50 }}
              />
            </div>

            <div className={styles.items}>
              <div
                className={variant === 'lowcost' ? styles.item : variant === 'vip' ? styles.itemPurple : styles.itemRed}
              >
                <img src="/img/chair.svg" className={styles.itemImage} />
                <img src="/img/lock_icon.svg" className={styles.lock} />
              </div>
              <div className={styles.itemLocked}>
                <img src="/img/chair.svg" className={styles.itemImage} />
                <img src="/img/lock_icon.svg" className={styles.lock} />
              </div>
              <div className={styles.itemLocked}>
                <img src="/img/chair.svg" className={styles.itemImage} />
                <img src="/img/lock_icon.svg" className={styles.lock} />
              </div>
            </div>
          </div>
        ))}

      {isBlocked ? (
        <div className={styles.disabledUpgradeActions}>
          <img src="/img/lock_icon.svg" />
          <p>Прокачайте основной предмет</p>
          <img src="/img/lock_icon.svg" />
        </div>
      ) : disabled ? (
        <button className={styles.disabledActions}>
          <p>Активировать</p>
        </button>
      ) : isUpgradeEnabled ? (
        <div className={styles.actions}>
          <button>
            450 <img src="/img/coin.svg" />
          </button>
          <button>Задание</button>
          <button>1.99 $USD</button>
        </div>
      ) : (
        <div className={styles.disabledUpgradeActions}>
          <img src="/img/lock_icon.svg" />
          <p>Нужен уровень Древа 7</p>
          <img src="/img/lock_icon.svg" />
        </div>
      )}
    </div>
  );
};

export default StoreCard;
