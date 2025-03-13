import { FC, useState } from 'react';
import subscribersIcon from '../../../../assets/icons/subscribers.png';
import copy from '../../../../assets/icons/copy.svg';
import arrow from '../../../../assets/icons/arrow.svg';
import BottomModal from '../../../shared/BottomModal/BottomModal.tsx';
import s from './InviteFriend.module.scss';
import classNames from 'classnames';
import { useGetUserQuery } from '../../../../redux';
import { formatAbbreviation } from '../../../../helpers';
import { Button } from '../../../shared';
import { useTranslation } from 'react-i18next';

interface InviteFriendProps {
  modalId: string;
  onClose: () => void;
}

export const InviteFriend: FC<InviteFriendProps> = ({
                                                      modalId,
                                                      onClose,
                                                    }: InviteFriendProps) => {
  const { t, i18n } = useTranslation('promotion');
  const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';
  const { data } = useGetUserQuery();

  const [isCopiedLink, setIsCopiedLink] = useState(false);

  const copyToClipboard = async (text: string, setCopiedState: (value: boolean) => void) => {
    try {
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 1000);
      await navigator.clipboard.writeText('' + text);
    } catch (error) {
      console.error('Ошибка при копировании:', error);
    }
  };

  const inviteTG = () => {
    const shareData = {
      title: `${t('p25')}`,
      text: `${t('p26')}`,
      url: `https://t.me/apusher_bot?start=${data?.id}`,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(error => console.log(t('p27'), error));
    } else {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(
          shareData.url,
        )}&text=${encodeURIComponent(shareData.text)}`,
        '_blank',
      );
    }
  };

  return (
    <BottomModal modalId={modalId} title={`${t('p28')}`} onClose={onClose} isCopiedLink={isCopiedLink}>
      <ul className={s.subscribers}>
        <li className={s.listBadge}>
          <span className={s.badge}>
            +{formatAbbreviation(120, 'number', { locale: locale })}{' '}
            <img src={subscribersIcon} height={18} width={18} alt="Подписчики" />
          </span>
          <span className={s.level}>1{t('p4')}.</span>
        </li>
        <li className={s.listBadge}>
          <span className={s.badge}>
            +{formatAbbreviation(40, 'number', { locale: locale })}{' '}
            <img src={subscribersIcon} height={18} width={18} alt="Подписчики" />
          </span>
          <span className={s.level}>2{t('p4')}.</span>
        </li>
      </ul>
      <div className={s.inputs}>
        <p className={s.description}>{t('p30')}</p>

        <div>
          <label>{t('p60')}</label>
          <div className={s.blockInput}>
            <input
              type="text"
              value={`https://t.me/apusher_bot?start=${data?.id}`}
              readOnly
              className={s.inputLink}
            />
            <Button
              onClick={() => copyToClipboard(`https://t.me/apusher_bot?start=${data?.id}`, setIsCopiedLink)}
              className={s.copyButton}
            >
               <img src={copy} height={14} width={14} alt="copy" />
            </Button>
          </div>
        </div>
        <div>
          <label>{t('p61')}</label>
          <div className={s.blockInput}>
            <input
              type="text"
              value={data?.id}
              readOnly
              className={s.inputLink}
            />
            <Button
              onClick={() => copyToClipboard(String(data?.id), setIsCopiedLink)}
              className={s.copyButton}
            >
              <img src={copy} height={16} width={16} alt="copy" />
            </Button>
          </div>
        </div>
        <Button className={classNames(s.buttonContainer, s.text)} onClick={inviteTG}>
          {t('p31')} <img src={arrow} height={16} width={16} alt="arrow" />
        </Button>
      </div>
    </BottomModal>
  );
};