import styles from './Footer.module.scss';
import { footerItems } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../shared';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';

export const Footer = () => {
  const [ activeButton, setActiveButton ] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleFooterItemClick = (id: number, redirectTo: string) => {
    if(footerActive) {
      setActiveButton(id);
      navigate(redirectTo);
    }
  };

  const footerActive = useSelector((state: RootState) => state.guide.footerActive);


  return (
    <div className={styles.footerItems}>
      {footerItems.map((item) => (
        <Button key={item.id}
                className={`${styles.footerItem} ${(activeButton === item.id && footerActive) ? styles.active : ''} `}
                onClick={() => handleFooterItemClick(item.id, item.redirectTo)
                }
        >
          <img src={item.icon} width={22} height={22} />
        </Button>
      ))}
    </div>
  );
};

