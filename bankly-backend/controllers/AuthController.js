'use strict';

const AuthService = require('../services/AuthService');
const validateRequest = require('../requests/AuthRequest');

/**
 * AuthController.js
 * Thin controller calling the business service.
 */

exports.login = async (req, res) => {
  try {
    const body = { email: req.body.email, password: req.body.password };
    const input = { body };

    const result = await AuthService.login(input);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[AuthController:login]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

exports.store = async (req, res) => {
  try {
    const body = { email: req.body.email, password: req.body.password };
    const input = { body };

    const result = await AuthService.store(input);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[AuthController:store]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const body = { email: req.body.email };
    const input = { body };

    const result = await AuthService.requestPasswordReset(input);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[AuthController:requestPasswordReset]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

exports.createNewPassword = async (req, res) => {
  try {
    const body = { code: req.body.code, password: req.body.password, confirm_password: req.body.confirm_password };
    const input = { body };

    const result = await AuthService.createNewPassword(input);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[AuthController:createNewPassword]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

