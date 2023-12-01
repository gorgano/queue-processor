export interface SendMessage {
    to: string,
    to_name: string,
    from: string,
    from_name: string,
    subject: string,
    body: string,
};


export enum SendTypes {
    mailgun = 'mailgun',
    sendgrid = 'sendgrid',
};

