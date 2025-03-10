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