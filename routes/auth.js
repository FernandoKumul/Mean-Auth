const { Router } = require('express');
const { createUser, revalidateToken, loginUser } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

// Crear un nuevo usuario
router.post( '/new', [
    check('name', 'El nombes obligatorio de minimo 6 caracteres').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6}),
    validateFields
] ,createUser );
//La ruta, las validaciones, la respuesta

// Login de usuario
router.post( '/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6}),
    validateFields
], loginUser );

// Validar y revalidar token
router.get( '/renew', validateJWT, revalidateToken );

module.exports = router;