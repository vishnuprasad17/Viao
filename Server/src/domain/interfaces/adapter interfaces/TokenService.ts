interface TokenService {
    generateToken(role: string, userId: string): Promise<{ accessToken: string, refreshToken: string, sessionId: string}>;
}

interface TokenPayload {
    role: string;
    userId: string;
    sessionId: string;
    iat?: number;
    exp?: number;
}

export {
    TokenService,
    TokenPayload
}