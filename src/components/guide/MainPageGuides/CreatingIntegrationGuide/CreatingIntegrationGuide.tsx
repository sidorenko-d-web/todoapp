import React, { ReactNode, useState } from 'react';
import styles from './CreatingIntegrationGuide.module.scss';

import img1 from '../../../../assets/gif/guide1.gif';
import { Guide } from '../../Guide/Guide';
import { useDispatch } from 'react-redux';
import { setDimHeader } from '../../../../redux';

interface CreatingIntegrationGuideProps {
  onClose: () => void;
  description: ReactNode;
  buttonText: string;
  align: 'left' | 'right';
  top: string;
}

export const CreatingIntegrationGuide: React.FC<CreatingIntegrationGuideProps> = ({
                                                                                    onClose,
                                                                                    description,
                                                                                    buttonText,
                                                                                    align,
                                                                                    top,
                                                                                  }) => {
  const [ isOpen, setIsOpen ] = useState(true);

  const dispatch = useDispatch();

  // useEffect(() => {
  //     dispatch(setDimHeader(true));
  // }, []);

  const handleClose = () => {
    dispatch(setDimHeader(false));
    onClose();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (

    <Guide align={align}
           zIndex={110}
           top={top}
           description={
             description
           }
           dimBackground={false}
           onClose={handleClose}>
      <button className={styles.nextBtn} onClick={handleClose}>{buttonText}</button>
      <img src={img1} className={top == '66%' ? styles.gifImageRight : styles.gifImageLeft} height={146} width={140} />
    </Guide>
  );
};