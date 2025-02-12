import styles from './Footer.module.scss';
import { footerItems } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TrackedButton } from '..';

export const Footer = () => {
  const [ activeButton, setActiveButton ] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleFooterItemClick = (id: number, redirectTo: string) => {
    setActiveButton(id);
    navigate(redirectTo);
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

