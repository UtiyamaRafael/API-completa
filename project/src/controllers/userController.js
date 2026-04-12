const userService = require('../services/userService');

const list = async (req, res, next) => {
  try {
    const result = await userService.list(req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body, req.user);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await userService.remove(req.params.id, req.user);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list,
  getById,
  update,
  remove,
};
