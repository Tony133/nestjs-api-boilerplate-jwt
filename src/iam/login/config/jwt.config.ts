process.loadEnvFile();

export interface JwtConfig {
  secret: string;
  audience?: string;
  issuer?: string;
  accessTokenTtl?: number;
  refreshTokenTtl?: number;
}

export const jwtConfig: JwtConfig = {
  secret: process.env.JWT_SECRET_KEY || 'default-secret',
  audience: process.env.JWT_TOKEN_AUDIENCE || 'default-audience',
  issuer: process.env.JWT_TOKEN_ISSUER || 'default-issuer',
  accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL || '3600', 10),
  refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL || '86400', 10),
};
