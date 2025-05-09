import styles from './SpecialIntegration.module.scss';
import goldCoinIcon from '../../../assets/icons/coin.png';
import blueCoinIcon from '../../../assets/icons/coin-blue-human.svg';
import lockIcon from '../../../assets/icons/lock_icon.svg';
import rocketIcon from '../../../assets/icons/rocket.svg';
import classname from 'classnames';
import { useTranslation } from 'react-i18next';
import { CompanyResponseDTO, useCreateIntegrationMutation, useGetProfileMeQuery } from '../../../redux';

interface SpecialIntegrationProps {
  company: CompanyResponseDTO;
}

export const SpecialIntegration = ({ company }: SpecialIntegrationProps) => {
  const { t } = useTranslation('integrations');
  const [createIntegration, { isError }] = useCreateIntegrationMutation();
  const {data: profileData, isError: isProfileError} = useGetProfileMeQuery()
  const isLocked = (profileData?.growth_tree_stage_id ?? 0) < company.growth_tree_stage;
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
          <img src={company.image_url} />
        </div>

      </div>

      <div className={styles.secondaryInfo}>
        <span className={styles.title}> {company.company_name} </span>

        <button
          className={classname(styles.button, { [styles.locked]: isLocked || isError || isProfileError })}
          onClick={() => createIntegration(company.id)}
        >
          {
            isError || isProfileError ? (
              <span className={styles.errorMessage}>
                <img className={styles.lockIcon} src={lockIcon} alt="lock" />
                  {t('i32')}
                <img className={styles.lockIcon} src={lockIcon} alt="lock" />
              </span>
            ) : (
              <>
                {isLocked && <img className={styles.lockIcon} src={lockIcon} alt="lock" />}
                <span className={styles.buttonTitle}>
                  {isLocked ? t('i32') : t('i31')}
                </span>
                {isLocked && <img className={styles.lockIcon} src={lockIcon} alt="lock" />}
              </>
            )
          }
        </button>
      </div>
    </div>
  );
};

