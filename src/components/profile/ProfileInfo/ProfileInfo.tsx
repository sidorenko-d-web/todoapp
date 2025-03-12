import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import styles from './ProfileInfo.module.scss';

// import profileImagePlaceholder from '../../../assets/icons/profile-icon-placeholder.svg';
import clanIcon from '../../../assets/icons/clan-red.svg';
import vipIcon from '../../../assets/icons/vip.svg';

import subscriptionLeveIcon from '../../../assets/icons/subscription-level.svg';

import { ProgressLine } from '../../shared';
import { AppRoute } from '../../../constants';
import { useSelector } from 'react-redux';
import { RootState, useGetCharacterByIdQuery, useGetCharacterQuery } from '../../../redux';
import { useTranslation } from 'react-i18next';
import { Loader, TrackedLink } from '../..';
import { SpinePlugin } from '@esotericsoftware/spine-phaser';
import { WardrobeSpineScene } from '../../../constants/wardrobeAnimation';

interface ProfileInfoProps {
  nickname: string;
  blogName: string;
  subscriptionIntegrationsLeft: number;
  position: number;
  isVip?: boolean;
  nonEditable?: boolean;
  strangerId?: string;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  nickname,
  subscriptionIntegrationsLeft,
  position,
  isVip,
  strangerId,
}) => {
  const { t } = useTranslation('profile');
  const lastActiveStage = useSelector((state: RootState) => state.treeSlice.lastActiveStage);

  const sceneRef = useRef<HTMLDivElement | null>(null);

  const gameRef = useRef<Phaser.Game | null>(null);
  const spineSceneRef = useRef<any | null>(null);

  const [size, setSize] = useState([0, 0]);
  const [isLoading, setLoading] = useState(true);
  const { data: character, isLoading: isCharacterLoading } = useGetCharacterQuery(undefined, { skip: !!strangerId });
  const { data: strangerCharacter, isLoading: isStrangerCharacterLoading } = useGetCharacterByIdQuery(
    { id: strangerId! },
    { skip: !strangerId },
  );

  const personScale = 0.065;

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!sceneRef.current || isCharacterLoading) return;

    setLoading(true);
    class SpineScene extends WardrobeSpineScene {
      create() {
        try {
          setLoading(false);
          this.createPerson(personScale);
        } catch (error: any) {
          if (error.message === 'add.spine') {
            console.log('avoid error');
            setSize(prev => [prev[0] + 1, prev[1]]);
          }
        }
        spineSceneRef.current = this;
        this.changeSkin(personScale, character ?? strangerCharacter);
        this.spineObject?.setY(118 / 2 + 15);
      }
    }

    const createAnimation = () => {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 118,
        height: 118,
        scene: [SpineScene],
        transparent: true,
        plugins: {
          scene: [{ key: 'SpinePlugin', plugin: SpinePlugin, mapping: 'spine' }],
        },
        parent: 'player',
      };

      gameRef.current = new Phaser.Game(config);
    };

    createAnimation();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        spineSceneRef.current = null;
      }
    };
  }, [isCharacterLoading, size]);

  return (
    <div className={styles.wrp}>
      <div className={`${styles.avatar} ${isVip ? styles.vip : ''}`}>
        <div className={styles.avatarImageWrp}>
          <div className={`${styles.clanWrp} ${isVip ? styles.vip : ''}`}>
            <span className={styles.position}>{`#${position}`}</span>
            <img src={clanIcon} alt="" />
          </div>

          <div className={styles.imagePlaceholder}>
            {isLoading && <Loader className={styles.loader} noMargin />}
            <div className={styles.perosnScene} ref={sceneRef} id="player"></div>
          </div>
          {isVip ? (
            <>
              <div className={styles.vipWrp}>
                <img src={vipIcon} alt="" />
                <span className={styles.vipText}>VIP</span>
              </div>
            </>
          ) : (
            <>
              <div style={{ height: '16px' }}></div>
            </>
          )}
        </div>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.info}>
          <div className={styles.nicknameWrp}>
            <span className={styles.nickname}>{nickname}</span>
            <TrackedLink
              trackingData={{
                eventType: 'button',
                eventPlace: 'В дерево роста - Профиль',
              }}
              to={AppRoute.ProgressTree}
              className={styles.subscribers}
            >
              {lastActiveStage}
            </TrackedLink>
            {/*{!nonEditable && (*/}
            {/*  <img*/}
            {/*    className={styles.edit}*/}
            {/*    src={editIcon}*/}
            {/*    onClick={() => openModal(MODALS.CHANGING_NICKNAME)}*/}
            {/*    alt=""*/}
            {/*  />*/}
            {/*)}*/}
          </div>

          {/*<p className={styles.blogName}>{blogName}</p>*/}
        </div>

        <div className={styles.subscription}>
          <div className={styles.subscriptionTextWrp}>
            <span className={styles.subscriptionText}>{t('p2')}</span>

            <div className={styles.subscriptionLevelWrp}>
              <span className={styles.subscriptionLevel}>{subscriptionIntegrationsLeft}/5</span>
              <img src={subscriptionLeveIcon} alt="" />
            </div>
          </div>
          <ProgressLine level={subscriptionIntegrationsLeft} color="blue" />
        </div>
      </div>
    </div>
  );
};
