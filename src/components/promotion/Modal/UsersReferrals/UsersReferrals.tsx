import React from 'react';
import BottomModal from '../../../shared/BottomModal/BottomModal';

import s from './UserReferrals.module.scss';
import subscribersIcon from '../../../../assets/icons/subscribers.png';

import { ReferralCard } from '../../ReferralCard/ReferralCard';
import { useGetCurrentUsersReferralsQuery } from '../../../../redux';
import { formatAbbreviation } from '../../../../helpers';
import { useTranslation } from 'react-i18next';

interface UserReferralsProps {
    modalId: string;
    onClose: () => void;
}


export const UserReferrals: React.FC<UserReferralsProps> = ({ modalId, onClose }: UserReferralsProps) => {
    const { t, i18n } = useTranslation('promotion');
    const locale = ['ru', 'en'].includes(i18n.language) ? (i18n.language as 'ru' | 'en') : 'ru';

    const { data, isLoading, error } = useGetCurrentUsersReferralsQuery();


    return (
        <BottomModal modalId={modalId} title={`${t('p32')}`} onClose={onClose}>

            <div className={s.badgesWrp} style={{ justifyContent: 'center'}}>
                <span className={s.badge}>
                    <span>+{formatAbbreviation(120, 'number', {locale: locale})}</span>
                    <img src={subscribersIcon} className={s.icon} height={14} width={14} alt="Подписчики" ></img>
                    <span className={s.level}>1{t('p4')}.</span>
                </span>
                <span className={s.badge}>
                    <span className={s.value}>+{formatAbbreviation(40, 'number', {locale: locale})}</span>
                    <img src={subscribersIcon} className={s.icon} height={14} width={14} alt="Подписчики" ></img>
                    <span className={s.level}>2{t('p4')}.</span>
                </span>

            </div>

            {isLoading && <p>{t('p34')}</p>}

            {error && <p>{t('p33')}</p>}

            {data &&
                <>
                    {data.referrals.map((referral: any, index: number) => (
                        <ReferralCard position={index + 1} name={referral.name} total_invited={referral.total_invited} />
                    ))}

                    {data.referrals.length === 0 && <p className={s.noReferrals}>{t('p35')}</p>}
                </>


            }
        </BottomModal>
    )
}