import bcrypt from "bcrypt";
import { PasswordService } from "../../domain/interfaces/application interfaces/PasswordService";


export class PasswordServiceImpl implements PasswordService {
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
      }
}