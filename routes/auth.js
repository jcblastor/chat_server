const { Router } = require('express');
const { check } = require('express-validator');

const { registerUser, loginUser, renewToken } = require('../controller/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/register',[
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty().isLength({min: 6}),
  validateFields
], registerUser);

router.post('/login', [
  check('email', 'El correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty().isLength({min: 6}),
  validateFields,
], loginUser);

router.get('/renew', validateJWT, renewToken);

module.exports = router;