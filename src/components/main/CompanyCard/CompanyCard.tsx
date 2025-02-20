import { FC } from 'react';
import { CompanyResponseDTO } from '../../../redux';
import lightningIcon from '../../../assets/icons/lightning.svg';
import starBlueIcon from '../../../assets/icons/star-blue.svg';
import starDarkGrayIcon from '../../../assets/icons/star-dark-gray.svg';
import integrationBlueIcon from '../../../assets/icons/integration-blue.svg';
import { getCompanyLogo } from '../../../utils/getCompanyLogo';
import s from './CompanyCard.module.scss';
import { isGuideShown } from '../../../utils';
import { GUIDE_ITEMS } from '../../../constants';
import { Button } from '../../shared';

interface CompanyCardProps {
  company: CompanyResponseDTO;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (id: string) => void;
}

const glowing = !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED);

export const CompanyCard: FC<CompanyCardProps> = ({ company, selected, onClick, disabled }) => {
  return (
    <Button
      className={
        s.card +
        ' ' +
        (selected ? ` ${s.selected}` : '') +
        ' ' +
        (disabled ? ` ${s.disabled}` : '') +
        ' ' +
        (glowing ? `${s.glowing}` : '')
      }
      onClick={() => onClick && !disabled && onClick(company.id)}
    >
      <header className={s.header}>
        <div className={s.icon}>
          <img src={lightningIcon} alt="Lightning" />
        </div>
        <img
          src={
            company.image_url ||
            getCompanyLogo(company.company_name) ||
            integrationBlueIcon
          }
          alt="Company Logo"
          className={s.companyIcon}
        />
      </header>
      <div className={s.content}>
        <h3 className={s.title}>{company.company_name}</h3>
        <div className={s.stars}>
          <img src={starBlueIcon} alt="" />
          <img src={starDarkGrayIcon} alt="" />
          <img src={starDarkGrayIcon} alt="" />
        </div>
        <div className={s.progressBar}>
          <div className={s.progressBarInner} style={{ width: `15%` }} />
        </div>
      </div>
    </Button>
  );
};
