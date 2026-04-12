const express = require('express');
const { registerSchema, loginSchema } = require('../validators/userSchema');
const validate = require('../middlewares/validate');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
