import { FC } from 'react';
import subscribersIcon from '../../../../assets/icons/subscribers.png';
import copy from '../../../../assets/icons/copy.svg';
import arrow from '../../../../assets/icons/arrow.svg';
import BottomModal from '../../../shared/BottomModal/BottomModal.tsx';
import s from './InviteFriend.module.scss';
import classNames from 'classnames';
import { useGetUserQuery } from '../../../../redux';
import { formatAbbreviation } from '../../../../helpers';

interface InviteFriendProps {
  modalId: string;
  onClose: () => void;
}

export const InviteFriend: FC<InviteFriendProps> = ({
                                                      modalId,
                                                      onClose,
                                                    }: InviteFriendProps) => {


  const { data } = useGetUserQuery();

  const inviteTG = () => {
    const shareData = {
      title: 'Приглашение в MiniApp',
      text: 'Присоединяйся ко мне в MiniApp и получи бонусы!',
      url: `https://t.me/wished_sentry_robot?start=${data?.id}`,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.log('Ошибка при шаринге', error));
    } else {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`, '_blank');
    }
  };


  return (
    <BottomModal modalId={modalId} title={'Пригласить друга'} onClose={onClose}>
      <ul className={s.subscribers}>
        <li className={s.listBadge}>
            <span className={s.badge}>
              +{formatAbbreviation(120)} <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
            </span>
          <span className={s.level}>1ур.</span>
        </li>
        <li className={s.listBadge}>

            <span className={s.badge}>
              +{formatAbbreviation(40)} <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
            </span>
          <span className={s.level}>2ур.</span>
        </li>
      </ul>
      <div>
        <p className={s.description}>
          Пригласите друга в MiniApp и получите бонус к <br /> подписчикам! Когда ваш друг
          будет
          приглашать ещё<br /> кого-то, вы
          также будете получать бонус.</p>
        <div className={s.blockInput}>
          <input type="text" value={`https://t.me/wished_sentry_robot?start=${data?.id}`} readOnly
                 className={s.inputLink} />
          <button onClick={() => navigator.clipboard.writeText(`https://t.me/wished_sentry_robot?start=${data?.id}`)}
                  className={s.copyButton}>
            <img src={copy} height={14} width={14} alt="copy" />
          </button>
        </div>
        <button className={classNames(s.buttonContainer, s.text)} onClick={inviteTG}>
          Поделиться ссылкой <img src={arrow} height={14} width={14} alt="arrow" />
        </button>
      </div>
    </BottomModal>
  );
};