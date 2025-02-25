import styles from './Partials.module.scss'
import SofaBroken from '../../../../assets/images/start-room/broken-sofa.svg'

export const Sofa = () => {
  return (
    <img src={SofaBroken} className={styles.sofa} alt="" />
  )
}