const path = require('path');

module.exports = {
  databaseFile: process.env.DATABASE_FILE || path.join(__dirname, '../../database.sqlite'),
  jwtSecret: process.env.JWT_SECRET || 'mudar-esse-segredo',
  tokenExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
};
