interface TokenService {
    generateToken(role: string, userId: string, existingTokenFamily?: string): Promise<TokenResponse>;
    verifyAccessToken(token: string): Promise<TokenPayload>;
    verifyRefreshToken(token: string): Promise<TokenPayload>;
    decodeToken(token: string): TokenPayload | null;
}

interface TokenPayload {
    role: string;
    userId: string;
    sessionId: string;
    type: 'access' | 'refresh';
    tokenFamily?: string;
    iat?: number;
    exp?: number;
}

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    sessionId: string;
    tokenFamily: string;
}

export {
    TokenService,
    TokenPayload,
    TokenResponse
}