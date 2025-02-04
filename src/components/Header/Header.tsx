import styles from "./Header.module.scss"
import CoinIcon from "../../assets/icons/coin.svg"
import AvatarIcon from "../../assets/icons/new-avatar.svg"
import FireIcon from "../../assets/icons/avatar-fire.svg"
import SubscribersIcon from "../../assets/icons/subscribers.png"
import { useGetCurrentUserProfileInfoQuery } from '../../redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute } from '../../constants'


export const Header = () => {
  const { data, isLoading } = useGetCurrentUserProfileInfoQuery()
  const navigate = useNavigate();

  const handleNavigateToProfile = () => {
    navigate(AppRoute.Profile);
  }

  return (
    <header className={styles.header}>
      <div className={styles.lowerHeader}>

        {isLoading && <p>Loading...</p>}

          <div className={styles.levelWrapper}>
              <div className={styles.avatarWrapper} onClick={handleNavigateToProfile}>
                  <img className={styles.avatarIcon} src={AvatarIcon} alt="AvatarIcon" />
                  <img className={styles.fireIcon} src={FireIcon} alt="FireIcon" />
              </div>


              <div className={styles.info}>
                  <div className={styles.subscribers}>
                      <p className={styles.subscribersNumber}>{data?.subscribers || 0}</p>
                      <img className={styles.subscribersIcon} src={SubscribersIcon} alt="SubscribersIcon" />
                  </div>

                  <div className={styles.levelInfo}>
                      <Link to={AppRoute.ProgressTree} className={styles.levelNumber}>{6}</Link>
                      <progress max={10} value={6} className={styles.levelProgressBar}></progress>
                  </div>
              </div>
          </div>

          <div className={styles.coinsWrapper}>
              <p className={styles.coins}>
                  {data?.points || 0}
              </p>
              <img className={styles.coinIcon} src={CoinIcon} alt="CoinIcon" />
          </div>
      </div>
    </header>
  )
}

export default Header