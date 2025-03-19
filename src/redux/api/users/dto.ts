export type GetUsersCountDTO = {
    players: number;
}
export type GetUserDTO = {
    ip: string,
    role_id: number,
    id: number,
    is_invited: boolean,
    is_superuser: boolean,
    is_email_verified: boolean,
    is_phone_verified: boolean,
}

export type GetUserWelcomeBonusDTO = {
    welcome_bonus: string,
    referrer_bonus: string
}

export type GetUserWelcomeRequestDTO = {
    user_id: number;
}