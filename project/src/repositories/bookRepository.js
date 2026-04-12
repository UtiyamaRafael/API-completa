const { run, get, all } = require('../config/db');

const allowedSortFields = ['id', 'title', 'published', 'created_at', 'updated_at'];

const create = async ({ title, content, published, user_id }) => {
  const result = await run(
    `INSERT INTO posts (title, content, published, user_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [title, content, published ? 1 : 0, user_id]
  );

  return findById(result.lastID);
};

const findById = async (id) =>
  get(
    `SELECT p.id, p.title, p.content, p.published, p.user_id, p.created_at, p.updated_at,
            u.name AS author_name, u.email AS author_email
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = ?`,
    [id]
  );

const list = async ({ title, user_id, sort = 'created_at', order = 'desc', page = 1, limit = 10 }) => {
  const filterClauses = [];
  const params = [];

  if (title) {
    filterClauses.push('p.title LIKE ?');
    params.push(`%${title}%`);
  }

  if (user_id) {
    filterClauses.push('p.user_id = ?');
    params.push(Number(user_id));
  }

  const where = filterClauses.length ? `WHERE ${filterClauses.join(' AND ')}` : '';
  const field = allowedSortFields.includes(sort) ? sort : 'created_at';
  const orderDirection = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const offset = (Number(page) - 1) * Number(limit);

  const totalRow = await get(`SELECT COUNT(*) AS count FROM posts p ${where}`, params);
  const posts = await all(
    `SELECT p.id, p.title, p.content, p.published, p.user_id, p.created_at, p.updated_at,
            u.name AS author_name, u.email AS author_email
     FROM posts p
     JOIN users u ON p.user_id = u.id
     ${where}
     ORDER BY ${field} ${orderDirection}
     LIMIT ?
     OFFSET ?`,
    [...params, Number(limit), offset]
  );

  return {
    total: totalRow ? totalRow.count : 0,
    data: posts.map((post) => ({
      ...post,
      published: Boolean(post.published),
    })),
  };
};

const update = async (id, data) => {
  const updates = [];
  const params = [];

  if (data.title) {
    updates.push('title = ?');
    params.push(data.title);
  }

  if (data.content) {
    updates.push('content = ?');
    params.push(data.content);
  }

  if (data.published !== undefined) {
    updates.push('published = ?');
    params.push(data.published ? 1 : 0);
  }

  if (!updates.length) {
    return findById(id);
  }

  params.push(new Date().toISOString());
  params.push(id);

  await run(
    `UPDATE posts SET ${updates.join(', ')}, updated_at = ? WHERE id = ?`,
    params
  );

  return findById(id);
};

const remove = async (id) => {
  const result = await run('DELETE FROM posts WHERE id = ?', [id]);
  return result.changes > 0;
};

module.exports = {
  create,
  findById,
  list,
  update,
  remove,
};
