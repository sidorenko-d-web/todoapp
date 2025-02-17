import styles from './Footer.module.scss';
import { footerItems } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { TrackedButton } from '..';

export const Footer = () => {
  const [ activeButton, setActiveButton ] = useState<number | null>(null);
  const navigate = useNavigate();

  const footerActive = useSelector((state: RootState) => state.guide.footerActive);
  const currentFooterItemId = useSelector((state: RootState) => state.guide.activeFooterItemId);


  useEffect(() => {
    setActiveButton((currentFooterItemId >= 0 && currentFooterItemId <= 4) ? currentFooterItemId : -1);
  }, [currentFooterItemId]);

  const handleFooterItemClick = (id: number, redirectTo: string) => {
    if(footerActive) {
      navigate(redirectTo);
    }

    setActiveButton((currentFooterItemId >= 0 && currentFooterItemId <= 4) ? currentFooterItemId : id)
  };

  
  return (
    <div className={styles.footerItems}>
      {footerItems.map((item) => (
        <TrackedButton
          trackingData={{
            eventType: 'button',
            eventPlace: `${item.title} - Футер`,
          }}
          key={item.id}
          className={`${styles.footerItem} ${activeButton === item.id ? styles.active : ''}`}
          onClick={() => handleFooterItemClick(item.id, item.redirectTo)}
        >
          <img src={item.icon} width={22} height={22} />
        </TrackedButton>
      ))}
    </div>
  );
};

