const bookService = require('../services/bookService');

const list = async (req, res, next) => {
  try {
    const result = await bookService.list(req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const book = await bookService.getById(req.params.id);
    return res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const book = await bookService.create(req.body, req.user);
    return res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const book = await bookService.update(req.params.id, req.body, req.user);
    return res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await bookService.remove(req.params.id, req.user);
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
