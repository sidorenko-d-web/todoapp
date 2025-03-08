import cup from '../../../assets/icons/cup.svg';
import chest from '../../../assets/icons/chest-purple.svg';
import lock from '../../../assets/icons/lock_icon.svg';
import { SliderSelect } from './Slider';
import { InfluencerRatingSteps, MODALS, useInfluencerRatingSteps } from '../../../constants';
import { TopUsers } from '../Modal';
import { useModal } from '../../../hooks';
import classNames from 'classnames';
import {
  RootState,
  setInputType,
  useGetCurrentUserProfileInfoQuery,
  useGetTopProfilesQuery,
  useGetUserQuery,
} from '../../../redux';
import { BindingConfirmationModal, BindingModal, BindingSuccessModal, TrackedButton } from '../../';

import s from './TopInfluencers.module.scss';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatAbbreviation } from '../../../helpers';
import { useDispatch, useSelector } from 'react-redux';

export const TopInfluencers = () => {
  const { t, i18n } = useTranslation('promotion');
  const locale = [ 'ru', 'en' ].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { openModal, closeModal } = useModal();
  const INFLUENCER_RATING_STEPS = useInfluencerRatingSteps();
  const [ isInfluencersLocked, setIsInfluencersLocked ] = useState(true);
  const [ influencersUnlockingStep, setInfluencersUnlockingStep ] = useState<keyof InfluencerRatingSteps>('email');
  const dispatch = useDispatch();
  const { data } = useGetTopProfilesQuery();
  const topProfiles = data?.profiles || [];

  const { data: userProfileData } = useGetCurrentUserProfileInfoQuery();
  const { inputType } = useSelector((state: RootState) => state.confirmation);
  const { data: userData } = useGetUserQuery();

  useEffect(() => {
    if(userData?.is_email_verified && userData?.is_phone_verified) {
      setIsInfluencersLocked(false);
    }

    if (userData?.is_email_verified) {
      setInfluencersUnlockingStep('phone');
      dispatch(setInputType('phone'));
    }
  }, [ userData?.is_email_verified ]);
  const userPosition = userProfileData && topProfiles
    ? topProfiles.findIndex((profile: { id: string; }) => profile.id === userProfileData.id)
    : -1;

  const position = userPosition !== -1 ? userPosition + 1 : topProfiles.length!;

  return (
    <>
      <h2 className={s.headerInfluencers}>
        <span className={s.textName}>{t('p8')}</span>
        <span className={s.badge}>
          <span>{isInfluencersLocked ? `${t('p9')}` : `${t('p20')} ${formatAbbreviation(10000, 'number', { locale: locale })}`}</span>
          <img src={isInfluencersLocked ? lock : cup} />
        </span>
      </h2>
      <section className={s.content}>
        <SliderSelect isInfluencersLocked={isInfluencersLocked} />

        <div className={s.wrapperInfo}>
          <div>
            <div className={s.chestText}>
              <span className={classNames(s.infoName, s.text)}>{`# ${isInfluencersLocked ? '???' : position}`}</span>
              <div className={classNames(s.infoName, s.text)}>
                <span>{t('p12')}</span>
                <img src={chest} alt="chest" />
              </div>
            </div>
            <div className={s.progressBar}>
              <span className={s.progress} style={{ width: `${userData?.role_id === 0 ? '0%' : userData?.role_id === 1 ? '50%' : '100%'}` }}></span>
            </div>
            <p className={s.textInfo}>
              {isInfluencersLocked
                ? `${t('p10')}`
                : `${t('p21')}`}
              <span className={s.textDay}> {t('p11')}</span>
            </p>
          </div>
          <TrackedButton
            trackingData={{
              eventType: 'button',
              eventPlace: `${isInfluencersLocked ? `${t('p13')}` : `${t('p22')}`} - ${t('p1')} - ${t('p8')}`,
            }}
            className={classNames(s.buttonContainer, s.text)}
            onClick={() => openModal(isInfluencersLocked ? MODALS.BINDING : MODALS.TOP_USERS)}
          >
            {isInfluencersLocked ? `${t('p13')}` : `${t('p22')}`}
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
                  openModal(inputType === 'phone' ? MODALS.BINDING_SUCCESS : MODALS.BINDING_CONFIRMATION);
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
          }</div>
      </section>
    </>
  );
};