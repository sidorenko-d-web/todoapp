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
import {useGetAllIntegrationsQuery} from '../../../redux';


interface CompanyCardProps {
  company: CompanyResponseDTO;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (id: string) => void;
}

const glowing = !isGuideShown(GUIDE_ITEMS.creatingIntegration.INTEGRATION_PUBLISHED);

export const CompanyCard: FC<CompanyCardProps> = ({ company, selected, onClick, disabled }) => {
  const {data: integrationsData} = useGetAllIntegrationsQuery({
    company_name: company.company_name
  })
  const integrationCount = integrationsData?.count ?? 0;


  const getBlueStarCount = (count: number = 0) => {
    if (count >= 18) return 3;
    if (count >= 10) return 2;
    if (count >= 4) return 1;
    return 0;
  };

  const thresholds = {
    firstStar: 4,
    secondStar: 10,
    thirdStar: 18
  };

  const getProgressBarPercentage = (count: number = 0) => {
    // Calculate which progress segment we're in
    if (count >= thresholds.thirdStar) {
      return 100;
    } else if (count >= thresholds.secondStar) {
      // Progress between second and third star (10-17)
      const progressInSegment = count - thresholds.secondStar;
      const segmentSize = thresholds.thirdStar - thresholds.secondStar;
      return (progressInSegment / segmentSize) * 100;
    } else if (count >= thresholds.firstStar) {
      // Progress between first and second star (4-9)
      const progressInSegment = count - thresholds.firstStar;
      const segmentSize = thresholds.secondStar - thresholds.firstStar;
      return (progressInSegment / segmentSize) * 100;
    } else {
      // Progress towards first star (0-3)
      return (count / thresholds.firstStar) * 100;
    }
  };

  const blueStarCount = getBlueStarCount(integrationCount);
  const progressPercentage = getProgressBarPercentage(integrationCount);


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
            {[...Array(3)].map((_, index) => (
              <img
                className={integrationCount >= thresholds.thirdStar ? s.starsMax : ''}
                key={index}
                src={index < blueStarCount ? starBlueIcon : starDarkGrayIcon}
                alt=""
              />
            ))}
        </div>

        {integrationCount < thresholds.thirdStar && (
          <div className={s.progressBar}>
            <div
              className={s.progressBarInner}
              style={{ width: `${progressPercentage}%` }}
            />
        </div>
        )}

      </div>
    </Button>
  );
};
