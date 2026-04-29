'use strict';

const SavingService = require('../services/SavingService');
const validateRequest = require('../requests/SavingRequest');

/**
 * SavingController.js
 * Thin controller calling the business service.
 */

exports.savings_contribute = async (req, res) => {
  try {
    const body = { account_id: req.body.account_id, amount: req.body.amount };
    const input = { body };

    const result = await SavingService.savings_contribute(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[SavingController:savings_contribute]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

exports.index = async (req, res) => {
  try {
    const input = {  };

    const result = await SavingService.index(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[SavingController:index]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

exports.show = async (req, res) => {
  try {
    const params = { id: req.params.id };
    const input = { params };

    const result = await SavingService.show(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[SavingController:show]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

exports.createSavings = async (req, res) => {
  try {
    const body = { goalName: req.body.goalName, targetAmount: req.body.targetAmount, deadline: req.body.deadline, descripption: req.body.descripption };
    const input = { body };

    const result = await SavingService.createSavings(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[SavingController:createSavings]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const params = { id: req.params.id };
    const input = { params };

    const result = await SavingService.delete(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[SavingController:delete]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

