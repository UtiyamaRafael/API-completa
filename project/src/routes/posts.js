const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createBookSchema,
  updateBookSchema,
  listBookSchema,
  createLoanSchema,
  updateLoanSchema,
  listLoanSchema,
} = require('../validators/postSchema');
const { idParamSchema } = require('../validators/userSchema');
const bookController = require('../controllers/bookController');
const loanController = require('../controllers/loanController');

const router = express.Router();

// Books
router.get('/books', auth, validate(listBookSchema, 'query'), bookController.list);
router.get('/books/:id', auth, validate(idParamSchema, 'params'), bookController.getById);
router.post('/books', auth, validate(createBookSchema), bookController.create);
router.put('/books/:id', auth, validate(idParamSchema, 'params'), validate(updateBookSchema), bookController.update);
router.delete('/books/:id', auth, validate(idParamSchema, 'params'), bookController.remove);

// Loans
router.get('/loans', auth, validate(listLoanSchema, 'query'), loanController.list);
router.get('/loans/:id', auth, validate(idParamSchema, 'params'), loanController.getById);
router.post('/loans', auth, validate(createLoanSchema), loanController.create);
router.put('/loans/:id', auth, validate(idParamSchema, 'params'), validate(updateLoanSchema), loanController.update);
router.delete('/loans/:id', auth, validate(idParamSchema, 'params'), loanController.remove);

module.exports = router;
