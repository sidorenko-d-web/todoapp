import integrationIcon from '../../../assets/icons/integration.svg';
import dotIcon from '../../../assets/icons/dot.svg';
import rocketIcon from '../../../assets/icons/rocket.svg';

import s from './IntegrationCreation.module.scss';
import CreatingIntegrationModal from '../CreatingIntegrationModal/CreatingIntegrationModal.tsx';
import { useModal } from '../../../hooks';
import { MODALS } from '../../../constants/modals.ts';

export const IntegrationCreation = () => {
  const progress = 39;
  const { openModal, closeModal } = useModal();

  return (
    <section className={s.integrationsControls}>
      <button className={s.button} onClick={() => openModal(MODALS.CREATING_INTEGRATION)}>
        Создать интеграцию
        <span className={s.buttonBadge}>3/5 <img src={integrationIcon} height={12} width={12}
                                                 alt="integration" /></span>
      </button>
      <CreatingIntegrationModal modalId={MODALS.CREATING_INTEGRATION} onClose={() => closeModal(MODALS.CREATING_INTEGRATION)}/>
      <div className={s.integration}>
        <div className={s.integrationHeader}>
          <h2 className={s.title}>Интеграция 3</h2>
          <span className={s.author}>Apusher <img src={dotIcon} height={14} width={14} alt="dot" /></span>
        </div>
        <div className={s.body}>
          <div className={s.info}>
            <div className={s.infoHeader}>
              <span>Создание интеграции...</span>
              <span>Осталось 34:20</span>
            </div>
            <div className={s.progressBar}>
              <div className={s.progressBarInner} style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button className={s.iconButton}>
            <img src={rocketIcon} alt="rocket" />
          </button>
        </div>
      </div>
    </section>
  );
};