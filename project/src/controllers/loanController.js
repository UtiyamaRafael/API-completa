const loanService = require('../services/loanService');

const list = async (req, res, next) => {
  try {
    const result = await loanService.list(req.query, req.user);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const loan = await loanService.getById(req.params.id, req.user);
    return res.status(200).json(loan);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const loan = await loanService.create(req.body, req.user);
    return res.status(201).json(loan);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const loan = await loanService.update(req.params.id, req.body, req.user);
    return res.status(200).json(loan);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await loanService.remove(req.params.id, req.user);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};