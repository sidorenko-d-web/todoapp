import s from './BottomModal.module.scss';
import { FC, PropsWithChildren, useEffect } from 'react';
import { Fade, Overlay } from '../common';
import closeIcon from '../../../assets/icons/close.svg';
import classNames from 'classnames';
import { useModal } from '../../../hooks';

import modalGripIcon from '../../../assets/icons/modal-grip.svg';

interface BottomModalProps {
  modalId: string;
  title: string;
  onClose: () => void;
  disabled?: boolean;
  disableScrollLock?: boolean;
  containerStyles?: string;
  modalStyles?: string;
  titleWrapperStyles?: string;
  headerStyles?: string;
  titleIcon?: string;
}

const BottomModal: FC<PropsWithChildren<BottomModalProps>> = ({
                                                                modalId,
                                                                title,
                                                                onClose,
                                                                disabled = false,
                                                                disableScrollLock = false,
                                                                containerStyles,
                                                                modalStyles,
                                                                children,
                                                                titleWrapperStyles,

                                                                headerStyles,
                                                                titleIcon,
}) =>
{
  const { getModalState } = useModal();

  const { isOpen } = getModalState(modalId);

  useEffect(() => {
    if (isOpen && !disableScrollLock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <Overlay className={classNames(s.overlay, containerStyles)}>
      <Fade open>
        <div className={classNames(s.modal, modalStyles)} onClick={e => e.stopPropagation()}>
          <div className={classNames({ [s.disabled]: disabled })}>
            <header className={classNames(s.header, headerStyles)}>
              <img src={modalGripIcon} alt={'Grip'} width={26} height={3} />
              <div className={classNames(s.titleWrapper, titleWrapperStyles)}>
                <h2 className={s.title}>
                  {title}
                  {titleIcon && <img src={titleIcon} alt={'title'} />}
                </h2>
                <button className={s.closeBtn} onClick={onClose}>
                  <img src={closeIcon} alt={'Close'} />
                </button>
              </div>
            </header>
            <div className={s.content}>{children}</div>
          </div>
        </div>
      </Fade>
    </Overlay>
  );
}


export default BottomModal;
