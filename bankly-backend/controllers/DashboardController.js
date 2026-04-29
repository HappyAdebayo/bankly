'use strict';

const DashboardService = require('../services/DashboardService');
const validateRequest = require('../requests/DashboardRequest');

/**
 * DashboardController.js
 * Thin controller calling the business service.
 */

exports.index = async (req, res) => {
  try {
    const input = {  };

    const result = await DashboardService.index(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[DashboardController:index]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

