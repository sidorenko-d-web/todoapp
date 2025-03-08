export type SendEmailConfirmationCodeDTO = {
    email: string;
}

export type SendPhoneConfirmationCodeDTO = {
    phone: string;
}

export type ConfrirmEmailDTO = {
    email: string;
    confirmation_code: string;
}

