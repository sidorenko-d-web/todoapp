import React from "react";
import BottomModal from "../../../shared/BottomModal/BottomModal";

import classNames from 'classnames';

import s from './UserReferrals.module.scss';
import subscribersIcon from '../../../../assets/icons/subscribers.svg';

import { ReferralCard } from "../../ReferralCard/ReferralCard";
import { useGetCurrentUsersReferralsQuery } from "../../../../redux";

interface UserReferralsProps {
    modalId: string;
    onClose: () => void;
}


export const UserReferrals: React.FC<UserReferralsProps> = ({ modalId, onClose }: UserReferralsProps) => {
    
    const { data, isLoading, error } = useGetCurrentUsersReferralsQuery();


    return (
        <BottomModal modalId={modalId} title={'Ваши реферралы'} onClose={onClose}>

            <div className={s.userCardBottom} style={{ justifyContent: 'center', margin: '10px' }}>
                <div className={s.userCardBonus} style={{ background: '#212129', padding: '4px 6px', borderRadius: '35px' }}>
                    <span className={s.badge}>
                        +120 <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
                        <span className={classNames(s.level, s.text)}>1ур.</span>
                    </span>

                </div>
                <div className={s.userCardBonus} style={{ background: '#212129', padding: '4px 6px', borderRadius: '35px' }}>
                    <span className={s.badge}>
                        +40 <img src={subscribersIcon} height={14} width={14} alt="Подписчики" />
                    </span>
                    <span className={classNames(s.level, s.text)}>2ур.</span>
                </div>

            </div>

            {isLoading && <p>Загрузка...</p>}

            {error && <p>Не удалось загрузить списокк рефералов</p>}

            {data &&
                <>
                    {data.referrals.map((referral: any, index: number) => (
                        <ReferralCard position={index} name={referral.name} total_invited={referral.total_invited} />
                    ))}

                    {data.referrals.length === 0 && <p className={s.noReferrals}>У вас пока нет рефералов</p>}
                </>

                
            }
        </BottomModal>
    )
}