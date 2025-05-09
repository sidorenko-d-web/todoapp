import { useTranslation } from 'react-i18next';
import { CentralModal } from '../../shared';
import styles from './IntegrationRewardModal.module.scss';
import starBlueIcon from '../../../assets/icons/star-blue.svg';
import starDarkGrayIcon from '../../../assets/icons/star-dark-gray.svg';
import medalBronze from '../../../assets/icons/medal-bronze.svg';
import medalGold from '../../../assets/icons/medal-gold.svg';
import medalSilver from '../../../assets/icons/medal-silver.svg';
import blueLightAnimation from '../../../assets/animations/blueLight.json';
import Lottie from 'lottie-react';
import { useModal } from '../../../hooks';
import { GUIDE_ITEMS, MODALS, starsThresholds } from '../../../constants';
import {
  setIsPublishedModalClosed,
  useAddItemToRoomMutation,
  useGetEquipedQuery,
  useGetInventoryAchievementsQuery,
  useRemoveItemFromRoomMutation,
} from '../../../redux';
import { useDispatch } from 'react-redux';
import { setGuideShown } from '../../../utils';
import { useState } from 'react';

export const IntegrationRewardModal = () => {
  const { getModalState, closeModal } = useModal();
  const { args } = getModalState<{
    integrationsCount: number;
    companyName: string;
    image_url: string;
  }>(MODALS.INTEGRATION_REWARD_CONGRATULATIONS);
  const { t, i18n } = useTranslation('integrations');
  const { data: equipped_items } = useGetEquipedQuery();
  const { refetch } = useGetInventoryAchievementsQuery();
  const [addAchivement] = useAddItemToRoomMutation();
  const [removeAchivement] = useRemoveItemFromRoomMutation();
  const [isEquipping, setIsEquipping] = useState(false);

  const dispatch = useDispatch();

  const stars = (function () {
    if ((args?.integrationsCount ?? 0) === 18) return 3;
    if ((args?.integrationsCount ?? 0) === 10) return 2;
    if ((args?.integrationsCount ?? 0) === 4) return 1;
    return 0;
  })();

  const { data: achievementsData } = useGetInventoryAchievementsQuery({
    company_name: args?.companyName,
    total_integrations: args?.integrationsCount?.toString(),
    level: stars.toString(),
  });

  const handleEquipAchivement = async () => {
    if (!equipped_items) return;

    setIsEquipping(true);

    closeModal(MODALS.INTEGRATION_REWARD_CONGRATULATIONS);
    setTimeout(async () => {
      try {

        await refetch()

        if (equipped_items.achievements.length > 0) {
          await removeAchivement({ achievements_to_remove: [{ id: equipped_items?.achievements?.[0].id }] });
        }
        const lastAchievement = achievementsData?.achievements[achievementsData.count - 1]

        if (lastAchievement?.id) {
          await addAchivement({ equipped_achievements: [{ id: lastAchievement.id, slot: 100 }] });
        } else {
          console.error('Achievement ID is undefined');
        }
        refetch();
        closeModal(MODALS.INTEGRATION_REWARD_CONGRATULATIONS);
      } catch (error) {
        console.log(error);
      } finally {
        setIsEquipping(false);
      }
    }, 5000)
  };

  const getModalIcon = () => {
    if (stars ?? 0 === starsThresholds.firstStar) return medalBronze;
    if (stars ?? 0 === starsThresholds.secondStar) return medalSilver;
    return medalGold;
  };
  const getMedalTypeText = () => {
    if (getModalIcon() === medalGold) return i18n.language === 'ru' ? 'золотую медаль' : 'gold medal';
    if (getModalIcon() === medalSilver) return i18n.language === 'ru' ? 'серебрянную медаль' : 'silver medal';
    return i18n.language === 'ru' ? 'бронзовую медаль' : 'bronze medal';
  };

  const ruText = `Поздравляем! Вы получили награду и ${getMedalTypeText()} за ${args?.integrationsCount ?? 0
    } интеграций с компанией ${args?.companyName ?? ''}!`;
  const enText = `Congratulations! You received a reward and ${getMedalTypeText()} for ${args?.integrationsCount ?? 0
    } integrations with company ${args?.companyName ?? ''}!`;

  return (
    <CentralModal
      title={t('i33')}
      modalId={MODALS.INTEGRATION_REWARD_CONGRATULATIONS}
      onClose={() => {
        setGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED_MODAL_CLOSED);
        dispatch(setIsPublishedModalClosed(true));
        closeModal(MODALS.INTEGRATION_REWARD_CONGRATULATIONS);
      }}
      headerStyles={styles.headerStyles}
    >
      <section className={styles.wrapper}>
        <main className={styles.mainContent}>
          <div className={styles.imageAndAnimation}>
            <img className={styles.image} src={args?.image_url} alt="Image" />
            {/* <div className={styles.images}> */}
            <Lottie animationData={blueLightAnimation} loop={true} className={styles.light} />;{/* </div> */}
          </div>

          <div className={styles.starsWrapper}>
            <img className={styles.medalIcon} src={getModalIcon()} alt="Medal icon" />
            {[...Array(3)].map((_, index) => (
              <img
                className={styles.starIcon}
                key={index}
                src={index < stars ? starBlueIcon : starDarkGrayIcon}
                alt="Star icon"
              />
            ))}
          </div>

          <span className={styles.text}> {i18n.language === 'ru' ? ruText : enText} </span>
        </main>

        <button className={styles.button} disabled={isEquipping} onClick={handleEquipAchivement}>
          {t('i34')}
        </button>
      </section>
    </CentralModal>
  );
};
