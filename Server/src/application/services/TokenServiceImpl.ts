import jwt from "jsonwebtoken";
import { injectable } from "inversify";
import { TokenService, TokenPayload, TokenResponse } from "../../domain/interfaces/application interfaces/TokenService";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

@injectable()
export class TokenServiceImpl implements TokenService {
    private readonly ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
    private readonly REFRESH_TOKEN_EXPIRY = '7d'; // 7 days
    private readonly JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
    private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

    /**
     * Generate a unique session ID
     */
    private generateSessionId(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Generate a unique token family ID
     */
    private generateTokenFamily(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Generate access and refresh tokens
     * @param role - User role (user, vendor, admin)
     * @param userId - User ID
     * @param existingTokenFamily - Optional existing token family (for token rotation)
     * @returns Token response with access token, refresh token, session ID, and token family
     */
    async generateToken(
        role: string, 
        userId: string, 
        existingTokenFamily?: string
    ): Promise<TokenResponse> {
        const sessionId = this.generateSessionId();
        const tokenFamily = existingTokenFamily || this.generateTokenFamily();

        // Access token payload
        const accessTokenPayload = {
            userId,
            role,
            sessionId,
            type: 'access'
        };

        // Refresh token payload
        const refreshTokenPayload: TokenPayload = {
            userId,
            role,
            sessionId,
            tokenFamily,
            type: 'refresh'
        };

        // Generate tokens
        const accessToken = jwt.sign(
            accessTokenPayload,
            this.JWT_ACCESS_SECRET,
            { 
                expiresIn: this.ACCESS_TOKEN_EXPIRY,
                issuer: 'viao-auth',
                audience: role
            }
        );

        const refreshToken = jwt.sign(
            refreshTokenPayload,
            this.JWT_REFRESH_SECRET,
            { 
                expiresIn: this.REFRESH_TOKEN_EXPIRY,
                issuer: 'viao-auth',
                audience: role
            }
        );

        return {
            accessToken,
            refreshToken,
            sessionId,
            tokenFamily
        };
    }

    /**
     * Verify access token
     * @param token - JWT access token
     * @returns Decoded token payload
     */
    async verifyAccessToken(token: string): Promise<TokenPayload> {
        try {
            const decoded = jwt.verify(token, this.JWT_ACCESS_SECRET, {
                issuer: 'viao-auth'
            }) as TokenPayload;

            if (decoded.type !== 'access') {
                throw new Error('Invalid token type');
            }

            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Access token expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid access token');
            }
            throw error;
        }
    }

    /**
     * Verify refresh token
     * @param token - JWT refresh token
     * @returns Decoded token payload
     */
    async verifyRefreshToken(token: string): Promise<TokenPayload> {
        try {
            const decoded = jwt.verify(token, this.JWT_REFRESH_SECRET, {
                issuer: 'viao-auth'
            }) as TokenPayload;

            if (decoded.type !== 'refresh') {
                throw new Error('Invalid token type');
            }

            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Refresh token expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid refresh token');
            }
            throw error;
        }
    }

    /**
     * Decode token without verification (for logout with expired tokens)
     * @param token - JWT token
     * @returns Decoded token payload or null
     */
    decodeToken(token: string): TokenPayload | null {
        return jwt.decode(token) as TokenPayload | null;
    }
}