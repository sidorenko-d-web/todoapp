import { FC } from 'react';
import { CompanyResponseDTO } from '../../../redux';
import lightningIcon from '../../../assets/icons/lightning.svg';
import starBlueIcon from '../../../assets/icons/star-blue.svg';
import starDarkGrayIcon from '../../../assets/icons/star-dark-gray.svg';
import integrationBlueIcon from '../../../assets/icons/integration-blue.svg';

import s from './CompanyCard.module.scss';
import { Button } from '../../shared';

interface CompanyCardProps {
  company: CompanyResponseDTO;
  selected?: boolean;
  onClick?: (id: string) => void;
}

export const CompanyCard: FC<CompanyCardProps> = ({ company, selected, onClick }) => {
  return (
    <Button className={s.card + ' ' + (selected ? ` ${s.selected}` : '')} onClick={() => onClick && onClick(company.id)}>
      <header className={s.header}>
        <div className={s.icon}>
          <img src={lightningIcon} alt="Lightning" width={12} height={12} />
        </div>
        <img src={company.image_url || integrationBlueIcon} alt="Photo" width={24} height={24} />
      </header>
      <div className={s.content}>
        <h3 className={s.title}>{company.company_name}</h3>
        <div className={s.stars}>
          <img src={starBlueIcon} alt="" width={14} height={14} />
          <img src={starDarkGrayIcon} alt="" width={14} height={14} />
          <img src={starDarkGrayIcon} alt="" width={14} height={14} />
        </div>
        <div className={s.progressBar}>
          <div
            className={s.progressBarInner}
            style={{ width: `15%` }}
          />
        </div>
      </div>
    </Button>
  );
};