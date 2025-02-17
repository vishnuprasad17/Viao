

export interface EmailService {
    sendEmail(data: {name: string, email: string, mobile: string, subject: string, message: string}): Promise<boolean>;
    sendOtp(email: string): Promise<string>;
}