const loanRepository = require('../repositories/loanRepository');
const bookRepository = require('../repositories/bookRepository');

const list = async (query, authUser) => {
  if (authUser.role !== 'admin') {
    query.user_id = authUser.id;
  }
  const result = await loanRepository.list(query);
  return {
    data: result.data,
    meta: {
      total: result.total,
      page: query.page || 1,
      limit: query.limit || 10,
    },
  };
};

const getById = async (id, authUser) => {
  const loan = await loanRepository.findById(id);
  if (!loan) {
    throw { status: 404, message: 'Empréstimo não encontrado' };
  }

  if (loan.user_id !== authUser.id && authUser.role !== 'admin') {
    throw { status: 403, message: 'Acesso negado' };
  }

  return loan;
};

const create = async (data, authUser) => {
  const book = await bookRepository.findById(data.book_id);
  if (!book) {
    throw { status: 404, message: 'Livro não encontrado' };
  }

  if (!book.available) {
    throw { status: 409, message: 'Livro não disponível' };
  }

  const existingLoan = await loanRepository.findByUserAndBook(authUser.id, data.book_id);
  if (existingLoan) {
    throw { status: 409, message: 'Você já tem este livro emprestado' };
  }

  const loan = await loanRepository.create({
    user_id: authUser.id,
    book_id: data.book_id,
    due_date: data.due_date,
  });

  // Marcar livro como indisponível
  await bookRepository.update(data.book_id, { available: 0 });

  return loan;
};

const update = async (id, data, authUser) => {
  const existing = await loanRepository.findById(id);
  if (!existing) {
    throw { status: 404, message: 'Empréstimo não encontrado' };
  }

  if (existing.user_id !== authUser.id && authUser.role !== 'admin') {
    throw { status: 403, message: 'Acesso negado' };
  }

  const updated = await loanRepository.update(Number(id), data);

  // Se devolvendo, marcar livro como disponível
  if (data.return_date && !existing.return_date) {
    await bookRepository.update(existing.book_id, { available: 1 });
  }

  return updated;
};

const remove = async (id, authUser) => {
  const existing = await loanRepository.findById(id);
  if (!existing) {
    throw { status: 404, message: 'Empréstimo não encontrado' };
  }

  if (existing.user_id !== authUser.id && authUser.role !== 'admin') {
    throw { status: 403, message: 'Acesso negado' };
  }

  const deleted = await loanRepository.remove(Number(id));
  if (!deleted) {
    throw { status: 404, message: 'Empréstimo não encontrado' };
  }

  // Marcar livro como disponível se não foi devolvido
  if (!existing.return_date) {
    await bookRepository.update(existing.book_id, { available: 1 });
  }
};

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};