const express = require('express');
const router = express.Router();
const AuthRequest = require('../requests/AuthRequest');
const AuthController = require('../controllers/AuthController');

router.post('/login', AuthRequest.login, AuthController.login);
router.post('/signup', AuthRequest.store, AuthController.store);
router.post('/request-password-reset', AuthRequest.requestPasswordReset, AuthController.requestPasswordReset);
router.post('/new-password', AuthRequest.createNewPassword, AuthController.createNewPassword);

module.exports = router;
