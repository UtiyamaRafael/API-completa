const buildErrorMessage = (error) => {
  if (error.errors) {
    return error.errors.map((item) => item.message).join(', ');
  }
  return error.message || 'Dados inválidos';
};

module.exports = (schema, source = 'body') => (req, res, next) => {
  try {
    const data = source === 'query' ? req.query : source === 'params' ? req.params : req.body;
    const parsed = schema.parse(data);

    if (source === 'query') req.query = parsed;
    else if (source === 'params') req.params = parsed;
    else req.body = parsed;

    next();
  } catch (error) {
    res.status(400).json({ error: buildErrorMessage(error) });
  }
};
