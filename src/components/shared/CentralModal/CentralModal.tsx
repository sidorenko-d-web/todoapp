import { FC, PropsWithChildren, useEffect } from 'react';
import s from './CentralModal.module.scss';
import { useModal } from '../../../hooks';
import { Fade, Overlay } from '../common';
import classNames from 'classnames';
import closeIcon from '../../../assets/icons/close.svg';
import { Button } from '..';

interface CentralModalProps {
  modalId: string;
  title: string;
  onClose: () => void;
  disabled?: boolean;
  disableScrollLock?: boolean;
  containerStyles?: string;
  modalStyles?: string;
  headerStyles?: string;
  titleIcon?: string;
}

export const CentralModal: FC<PropsWithChildren<CentralModalProps>> = ({
                                                                         modalId,
                                                                         title,
                                                                         onClose,
                                                                         disabled = false,
                                                                         disableScrollLock = false,
                                                                         containerStyles,
                                                                         modalStyles,
                                                                         children,
                                                                         headerStyles,
                                                                         titleIcon,
                                                                       }) => {
  const { getModalState } = useModal();

  const { isOpen } = getModalState(modalId);


  useEffect(() => {
    if (isOpen && !disableScrollLock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [ isOpen ]);

  if (!isOpen) return null;
  return (
    <Overlay className={classNames(s.overlay, containerStyles)}>
      <Fade open>
        <div className={classNames(s.modal, modalStyles)} onClick={e => e.stopPropagation()}>
          <div className={classNames({ [s.disabled]: disabled })}>
            <header className={classNames(s.header, headerStyles)}>
              <h2 className={s.title}>{title}{titleIcon &&
                <img src={titleIcon} alt={'title'} width={18} height={18} />}</h2>
              <Button className={s.closeBtn} onClick={onClose}>
                <img src={closeIcon} alt={'Close'} />
              </Button>
            </header>
            <div>{children}</div>
          </div>
        </div>
      </Fade>
    </Overlay>
  );
};
