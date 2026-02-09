if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be defined in production environment');
}

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  saltRounds: 10
};
