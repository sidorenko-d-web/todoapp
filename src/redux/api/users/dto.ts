export type GetUsersCountDTO = {
    players: number;
}
export type GetUserDTO = {
    ip: string,
    role_id: number,
    id: number,
    is_invited: boolean,
    is_email_verified: false,
    is_phone_verified: false,
}