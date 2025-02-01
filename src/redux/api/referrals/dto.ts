export type ReferralDTO = {
    name: string;
    total_invited: number;
}

export type GetReferralsDTO = {
    referrals: ReferralDTO[];
}