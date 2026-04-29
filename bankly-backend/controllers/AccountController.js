'use strict';

const AccountService = require('../services/AccountService');
const validateRequest = require('../requests/AccountRequest');

/**
 * AccountController.js
 * Thin controller calling the business service.
 */

exports.withdraw = async (req, res) => {
  try {
    const body = { amount: req.body.amount };
    const input = { body };

    const result = await AccountService.withdraw(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[AccountController:withdraw]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

exports.index = async (req, res) => {
  try {
    const input = {  };

    const result = await AccountService.index(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[AccountController:index]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

exports.transfer = async (req, res) => {
  try {
    const body = { to_account_number: req.body.to_account_number, amount: req.body.amount, description: req.body.description };
    const input = { body };

    const result = await AccountService.transfer(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[AccountController:transfer]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

