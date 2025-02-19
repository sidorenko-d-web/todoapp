import styles from './SpecialIntegration.module.scss';
import { GrowthTreeResponse, UserProfileInfoResponseDTO } from '../../../redux';
import whiteLogo from '../../../assets/Icons/white-logo.svg';
import goldCoinIcon from '../../../assets/Icons/coin.png';
import blueCoinIcon from '../../../assets/Icons/coin-blue-human.svg';
import lockIcon from '../../../assets/Icons/lock_icon.svg';
import rocketIcon from '../../../assets/Icons/rocket.svg';

interface SpecialIntegrationProps {
  title: string;
  icon: string;
  tree?: GrowthTreeResponse;
  profile?: UserProfileInfoResponseDTO;
}

export const SpecialIntegration = ({ title, icon, tree, profile }: SpecialIntegrationProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.mainInfo}>
        <div className={styles.items}>
          <div className={styles.coinsWrapper}>
            <span className={styles.text}>x15</span>
            <img src={goldCoinIcon} className={styles.mainInfoIcon} />
          </div>

          <div className={styles.coinsWrapper}>
            <span className={styles.text}>x5</span>
            <img src={blueCoinIcon} className={styles.mainInfoIcon} />
          </div>

          <div className={styles.coinsWrapper}>
            <img src={rocketIcon} className={styles.rocketIcon} />
            <img src={rocketIcon} className={styles.rocketIcon} />
            <img src={rocketIcon} className={styles.rocketIcon} />
          </div>

        </div>

        <div className={styles.iconWrp}>
          <img src={whiteLogo} className={styles.icon} />
        </div>

      </div>

      <div className={styles.secondaryInfo}>
        <span className={styles.title}> Apusher. Уникальная интеграция </span>
        <button className={styles.button}>
          <img className={styles.lockIcon} src={lockIcon} alt="lock" />
          <span className={styles.buttonTitle}> Нужен уровень Дерева 100 </span>
          <img className={styles.lockIcon} src={lockIcon} alt="lock" />
        </button>
      </div>
    </div>
  );
};

