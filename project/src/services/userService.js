const userRepository = require('../repositories/userRepository');
const bookRepository = require('../repositories/bookRepository');

const list = async (query) => {
  const result = await userRepository.list(query);
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
  const user = await userRepository.findById(id);
  if (!user) {
    throw { status: 404, message: 'Usuário não encontrado' };
  }

  const books = await bookRepository.list({ user_id: id, page: 1, limit: 100 });
  return {
    ...user,
    books: books.data,
  };
};

const update = async (id, data, authUser) => {
  if (authUser.id !== Number(id) && authUser.role !== 'admin') {
    throw { status: 403, message: 'Acesso negado' };
  }

  const updated = await userRepository.update(Number(id), data);
  if (!updated) {
    throw { status: 404, message: 'Usuário não encontrado' };
  }

  return updated;
};

const remove = async (id, authUser) => {
  if (authUser.id !== Number(id) && authUser.role !== 'admin') {
    throw { status: 403, message: 'Acesso negado' };
  }

  const deleted = await userRepository.remove(Number(id));
  if (!deleted) {
    throw { status: 404, message: 'Usuário não encontrado' };
  }
};

module.exports = {
  list,
  getById,
  update,
  remove,
};
