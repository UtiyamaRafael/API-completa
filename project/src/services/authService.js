const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { jwtSecret, tokenExpiresIn } = require('../config/database');

const register = async ({ name, email, password }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw { status: 409, message: 'Email já cadastrado' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await userRepository.create({ name, email, password: hashedPassword });

  return jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, jwtSecret, {
    expiresIn: tokenExpiresIn,
  });
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw { status: 401, message: 'Credenciais inválidas' };
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw { status: 401, message: 'Credenciais inválidas' };
  }

  return jwt.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, {
    expiresIn: tokenExpiresIn,
  });
};

module.exports = {
  register,
  login,
};
