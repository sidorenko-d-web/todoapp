import { FC, PropsWithChildren, useEffect } from 'react';
import s from './CentralModal.module.scss';
import { useModal } from '../../../hooks';
import { Fade, Overlay } from '../common';
import classNames from 'classnames';
import closeIcon from '../../../assets/icons/close.svg';
import { Button } from '..';
import { isGuideShown } from '../../../utils';
import { GUIDE_ITEMS, MODALS } from '../../../constants';
import { useDispatch } from 'react-redux';
import { setDimHeader } from '../../../redux';

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
  overlayOpacity?: number;
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
  overlayOpacity = 0.85,
}) => {
  const { getModalState } = useModal();
  const { isOpen } = getModalState(modalId);

  const dispatch = useDispatch();

  
  useEffect(() => {
    if (isOpen && !disableScrollLock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);


    useEffect(() => {
      dispatch(setDimHeader(false));
    }, []);
    

  if (!isOpen) return null;

  const overlayStyle = {
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
  };

  const higher = modalId === MODALS.DAYS_IN_A_ROW && !isGuideShown(GUIDE_ITEMS.integrationPage.INTEGRATION_PAGE_GUIDE_SHOWN);

  return (
    <Overlay className={classNames(s.overlay, containerStyles,
      {[s.visibleOverflow] : !isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)}
    )} style={overlayStyle}>
      <Fade open>
        <div className={classNames(s.modal, modalStyles, {[s.higher] : higher},
          {[s.visibleOverflow] : !isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN)})}
           onClick={e => e.stopPropagation()}>
          <div className={classNames({ [s.disabled]: disabled })}>
            <header className={classNames(s.header, headerStyles)}>
              <h2 className={s.title}>{title}{titleIcon &&
                <img src={titleIcon} alt={'title'} width={18} height={18} />}</h2>

                {isGuideShown(GUIDE_ITEMS.mainPageSecondVisit.FINISH_TUTORIAL_GUIDE_SHOWN) &&
                <Button className={s.closeBtn} onClick={() => {
                  dispatch(setDimHeader(false));
                  onClose();
                }}>
                  <img src={closeIcon} alt={'Close'} />
                </Button>}
                
            </header>
            <div>{children}</div>
          </div>
        </div>
      </Fade>
    </Overlay>
  );
};
