const { run, get, all } = require('../config/db');

const allowedSortFields = ['id', 'name', 'email', 'created_at', 'updated_at'];

const create = async ({ name, email, password }) => {
  const result = await run(
    `INSERT INTO users (name, email, password, role, created_at, updated_at)
     VALUES (?, ?, ?, 'user', datetime('now'), datetime('now'))`,
    [name, email, password]
  );

  return {
    id: result.lastID,
    name,
    email,
    role: 'user',
  };
};

const findByEmail = async (email) =>
  get('SELECT * FROM users WHERE email = ?', [email]);

const findById = async (id) =>
  get(
    `SELECT id, name, email, role, created_at, updated_at
     FROM users
     WHERE id = ?`,
    [id]
  );

const list = async ({ name, email, role, sort = 'created_at', order = 'desc', page = 1, limit = 10 }) => {
  const filterClauses = [];
  const params = [];

  if (name) {
    filterClauses.push('name LIKE ?');
    params.push(`%${name}%`);
  }

  if (email) {
    filterClauses.push('email LIKE ?');
    params.push(`%${email}%`);
  }

  if (role) {
    filterClauses.push('role = ?');
    params.push(role);
  }

  const where = filterClauses.length ? `WHERE ${filterClauses.join(' AND ')}` : '';
  const field = allowedSortFields.includes(sort) ? sort : 'created_at';
  const orderDirection = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const offset = (Number(page) - 1) * Number(limit);

  const totalRow = await get(`SELECT COUNT(*) AS count FROM users ${where}`, params);
  const users = await all(
    `SELECT id, name, email, role, created_at, updated_at
     FROM users
     ${where}
     ORDER BY ${field} ${orderDirection}
     LIMIT ?
     OFFSET ?`,
    [...params, Number(limit), offset]
  );

  return {
    total: totalRow ? totalRow.count : 0,
    data: users,
  };
};

const update = async (id, data) => {
  const updates = [];
  const params = [];

  if (data.name) {
    updates.push('name = ?');
    params.push(data.name);
  }

  if (data.email) {
    updates.push('email = ?');
    params.push(data.email);
  }

  if (data.password) {
    updates.push('password = ?');
    params.push(data.password);
  }

  if (!updates.length) {
    return null;
  }

  params.push(new Date().toISOString());
  params.push(id);

  await run(
    `UPDATE users SET ${updates.join(', ')}, updated_at = ? WHERE id = ?`,
    params
  );

  return findById(id);
};

const remove = async (id) => {
  const result = await run('DELETE FROM users WHERE id = ?', [id]);
  return result.changes > 0;
};

module.exports = {
  create,
  findByEmail,
  findById,
  list,
  update,
  remove,
};
