const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const token = await authService.register(req.body);
    return res.status(201).json({ message: 'Usuário registrado com sucesso', token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const token = await authService.login(req.body);
    return res.status(200).json({ message: 'Login efetuado com sucesso', token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
