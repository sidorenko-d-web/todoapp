import cup from '../../../assets/icons/cup.svg';
import chest from '../../../assets/icons/chest-purple.svg';
import lock from '../../../assets/icons/lock_icon.svg';
import { SliderSelect } from './Slider';
import { INFLUENCER_RATING_STEPS, InfluencerRatingSteps, MODALS } from '../../../constants';
import { TopUsers } from '../Modal';
import { useModal } from '../../../hooks';
import classNames from 'classnames';
import { useGetCurrentUserProfileInfoQuery, useGetTopProfilesQuery } from '../../../redux';
import { BindingConfirmationModal, BindingModal, BindingSuccessModal, TrackedButton } from '../../';

import s from './TopInfluencers.module.scss';
import { useState } from 'react';

export const TopInfluencers = () => {
  const { openModal, closeModal } = useModal();

  const [ isInfluencersLocked, setIsInfluencersLocked ] = useState(true);
  const [ influencersUnlockingStep, setInfluencersUnlockingStep ] = useState<keyof InfluencerRatingSteps>('email');

  const { data } = useGetTopProfilesQuery();
  const topProfiles = data?.profiles || [];

  const { data: userProfileData } = useGetCurrentUserProfileInfoQuery();

  const userPosition = userProfileData && topProfiles
    ? topProfiles.findIndex((profile: { id: string; }) => profile.id === userProfileData.id)
    : -1;

  const position = userPosition !== -1 ? userPosition + 1 : topProfiles.length!;

  return (
    <>
      <h2 className={s.headerInfluencers}>
        <span className={s.textName}>Лучшие инфлюенсеры</span>
        <span className={s.badge}>
          <span>{isInfluencersLocked ? 'Закрыто' : 'Топ 10 000'}</span><img src={isInfluencersLocked ? lock : cup}
                                                                            height={14} width={14} />
        </span>
      </h2>
      <section className={s.wrapperInfo}>
        <SliderSelect isInfluencersLocked={isInfluencersLocked} />
        <div className={s.contentChest}>
          <div className={s.chestText}>
            <span className={classNames(s.infoName, s.text)}>{`# ${isInfluencersLocked ? '???' : position}`}</span>
            <div className={classNames(s.infoName, s.text)}>
              <span>Драгоценный сундук</span>
              <img src={chest} height={14} width={14} alt="chest" />
            </div>
          </div>
          <div className={s.progressBar}>
            <span className={s.progress} style={{ width: '15%' }}></span>
          </div>
        </div>
        <p className={s.textInfo}>
          {isInfluencersLocked
            ? 'Лучшие инфлюенсеры получают Драгоценный сундук!'
            : 'Войдите в топ #100 инфлюенсеров по количеству подписчиков на этой неделе, чтобы получить Драгоценный сундук!'}
          <span className={s.textDay}> До выдачи призов осталось 3д.</span>
        </p>
        <TrackedButton
          trackingData={{
            eventType: 'button',
            eventPlace: `${isInfluencersLocked ? 'Открыть доступ к рейтингу инфлюенсеров!' : 'Смотреть список'} - Продвижение - Лучшие инфлюенсеры`,
          }}
          className={classNames(s.buttonContainer, s.text)}
          onClick={() => openModal(isInfluencersLocked ? MODALS.BINDING : MODALS.TOP_USERS)}
        >
          {isInfluencersLocked ? 'Открыть доступ к рейтингу инфлюенсеров!' : 'Смотреть список'}
        </TrackedButton>

        <TopUsers modalId={MODALS.TOP_USERS} onClose={() => closeModal(MODALS.TOP_USERS)} />

        {
          isInfluencersLocked && <>
            <BindingModal
              modalId={MODALS.BINDING}
              onClose={() => closeModal(MODALS.BINDING)}
              binding={INFLUENCER_RATING_STEPS[influencersUnlockingStep].binding}
              onNext={() => {
                closeModal(MODALS.BINDING);
                openModal(MODALS.BINDING_CONFIRMATION);
              }}
            />
            <BindingConfirmationModal
              modalId={MODALS.BINDING_CONFIRMATION}
              onClose={() => closeModal(MODALS.BINDING_CONFIRMATION)}
              confirmation={INFLUENCER_RATING_STEPS[influencersUnlockingStep].confirmation}
              onNext={() => {
                closeModal(MODALS.BINDING_CONFIRMATION);
                openModal(MODALS.BINDING_SUCCESS);
              }}
            />
            <BindingSuccessModal
              modalId={MODALS.BINDING_SUCCESS}
              onClose={() => closeModal(MODALS.BINDING_SUCCESS)}
              success={INFLUENCER_RATING_STEPS[influencersUnlockingStep].success}
              onNext={() => {
                closeModal(MODALS.BINDING_SUCCESS);
                switch (influencersUnlockingStep) {
                  case 'email':
                    setInfluencersUnlockingStep('phone');
                    openModal(MODALS.BINDING);
                    break;
                  case 'phone':
                    setInfluencersUnlockingStep('email');
                    setIsInfluencersLocked(false);
                    break;
                }
              }}
            />
          </>
        }
      </section>
    </>
  );
};