const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  updateSchema,
  listSchema,
  idParamSchema,
} = require('../validators/userSchema');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', auth, validate(listSchema, 'query'), userController.list);
router.get('/:id', auth, validate(idParamSchema, 'params'), userController.getById);
router.put('/:id', auth, validate(idParamSchema, 'params'), validate(updateSchema), userController.update);
router.delete('/:id', auth, validate(idParamSchema, 'params'), userController.remove);

module.exports = router;
