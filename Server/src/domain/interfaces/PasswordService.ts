

export interface PasswordService {
    hashPassword(password: string): Promise<string>;
}