import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { TokenService, TokenPayload } from "../../domain/interfaces/TokenService";

const JWT_ACCESS_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_EXPIRY = Math.floor(Date.now() /  1000) + 60 * 60; //1hr from now
const REFRESH_TOKEN_EXPIRY = '7d';

@injectable()
export class TokenServiceImpl implements TokenService {

    async generateToken(role: string, userId: string): Promise<{ accessToken: string, refreshToken: string, sessionId: string }> {
        // Implement token generation logic here
        const sessionId = uuidv4();
        const payload: TokenPayload = { role, userId, sessionId };

        // Generate tokens
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY
        });

        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRY
        });

        return { accessToken, refreshToken, sessionId };
    }
}