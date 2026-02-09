export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  saltRounds: 10
};
