const bookRepository = require('../repositories/bookRepository');

const list = async (query) => {
  const result = await bookRepository.list(query);
  return {
    data: result.data,
    meta: {
      total: result.total,
      page: query.page || 1,
      limit: query.limit || 10,
    },
  };
};

const getById = async (id) => {
  const book = await bookRepository.findById(id);
  if (!book) {
    throw { status: 404, message: 'Livro não encontrado' };
  }
  return book;
};

const create = async (data, authUser) => {
  const book = await bookRepository.create({
    title: data.title,
    author: data.author,
    isbn: data.isbn,
    description: data.description,
    published_year: data.published_year,
    available: data.available === true ? 1 : 0,
    user_id: authUser.id,
  });
  return book;
};

const update = async (id, data, authUser) => {
  const existing = await bookRepository.findById(id);
  if (!existing) {
    throw { status: 404, message: 'Livro não encontrado' };
  }

  if (existing.user_id !== authUser.id && authUser.role !== 'admin') {
    throw { status: 403, message: 'Acesso negado' };
  }

  const updated = await bookRepository.update(Number(id), {
    title: data.title,
    author: data.author,
    isbn: data.isbn,
    description: data.description,
    published_year: data.published_year,
    available: data.available === undefined ? undefined : data.available ? 1 : 0,
  });

  return updated;
};

const remove = async (id, authUser) => {
  const existing = await bookRepository.findById(id);
  if (!existing) {
    throw { status: 404, message: 'Livro não encontrado' };
  }

  if (existing.user_id !== authUser.id && authUser.role !== 'admin') {
    throw { status: 403, message: 'Acesso negado' };
  }

  const deleted = await bookRepository.remove(Number(id));
  if (!deleted) {
    throw { status: 404, message: 'Livro não encontrado' };
  }
};

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
