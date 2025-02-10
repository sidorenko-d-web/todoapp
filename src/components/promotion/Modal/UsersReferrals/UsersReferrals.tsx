import React from 'react';
import BottomModal from '../../../shared/BottomModal/BottomModal';

import s from './UserReferrals.module.scss';
import subscribersIcon from '../../../../assets/icons/subscribers.png';

import { ReferralCard } from '../../ReferralCard/ReferralCard';
import { useGetCurrentUsersReferralsQuery } from '../../../../redux';
import { formatAbbreviation } from '../../../../helpers';

interface UserReferralsProps {
    modalId: string;
    onClose: () => void;
}


export const UserReferrals: React.FC<UserReferralsProps> = ({ modalId, onClose }: UserReferralsProps) => {



    const { data, isLoading, error } = useGetCurrentUsersReferralsQuery();


    return (
        <BottomModal modalId={modalId} title={'Ваши реферралы'} onClose={onClose}>

            <div className={s.badgesWrp} style={{ justifyContent: 'center'}}>
                <span className={s.badge}>
                    <span>+{formatAbbreviation(120)}</span>
                    <img src={subscribersIcon} className={s.icon} height={14} width={14} alt="Подписчики" ></img>
                    <span className={s.level}>1ур.</span>
                </span>
                <span className={s.badge}>
                    <span className={s.value}>+{formatAbbreviation(40)}</span>
                    <img src={subscribersIcon} className={s.icon} height={14} width={14} alt="Подписчики" ></img>
                    <span className={s.level}>2ур.</span>
                </span>

            </div>

            {isLoading && <p>Загрузка...</p>}

            {error && <p>Не удалось загрузить списокк рефералов</p>}

            {data &&
                <>
                    {data.referrals.map((referral: any, index: number) => (
                        <ReferralCard position={index + 1} name={referral.name} total_invited={referral.total_invited} />
                    ))}

                    {data.referrals.length === 0 && <p className={s.noReferrals}>У вас пока нет рефералов</p>}
                </>


            }
        </BottomModal>
    )
}