import styles from "./Header.module.scss"
import CoinIcon from "../../assets/icons/coin.svg"
import AvatarIcon from "../../assets/icons/new-avatar.svg"
import FireIcon from "../../assets/icons/avatar-fire.svg"
import SubscribersIcon from "../../assets/images/subscribers.png"
// import { selectProfile } from "../../redux/selectors/profile"
// import { useSelector } from "react-redux"

export const Header = () => {
//   const profile = useSelector(selectProfile)

  return (
    <header className={styles.header}>
    <div className={styles.lowerHeader}>
        <div className={styles.levelWrapper}>


            <div className={styles.avatarWrapper}>
                <img className={styles.avatarIcon} src={AvatarIcon} alt="AvatarIcon" />
                <img className={styles.fireIcon} src={FireIcon} alt="FireIcon" /> 
            </div>


            <div className={styles.info}>
                <div className={styles.subscribers}>
                    <p className={styles.subscribersNumber}>123 456</p>
                    <img className={styles.subscribersIcon} src={SubscribersIcon} alt="SubscribersIcon" />
                </div>

                <div className={styles.levelInfo}>
                    <p className={styles.levelNumber}>6</p>
                    <progress max={10} value={6} className={styles.levelProgressBar}></progress>
                </div>
            </div>
        </div>

        <div className={styles.coinsWrapper}>
            <p className={styles.coins}>
                123 456
            </p>
            <img className={styles.coinIcon} src={CoinIcon} alt="CoinIcon" />
        </div>
    </div>
    </header>
  )
}

export default Header