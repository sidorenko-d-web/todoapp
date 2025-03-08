export type SendEmailConfirmationCodeDTO = {
    email: string;
}

export type SendPhoneConfirmationCodeDTO = {
    phone_number: string;
}

export type ConfrirmEmailDTO = {
    email: string;
    confirmation_code: string;
}

