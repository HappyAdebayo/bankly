'use strict';

const KycService = require('../services/KycService');
const validateRequest = require('../requests/KycRequest');

/**
 * KycController.js
 * Thin controller calling the business service.
 */

exports.index = async (req, res) => {
  try {
    const input = {  };

    const result = await KycService.index(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[KycController:index]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

exports.show = async (req, res) => {
  try {
    const params = { id: req.params.id };
    const input = { params };

    const result = await KycService.show(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[KycController:show]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

exports.store = async (req, res) => {
  try {
    const body = { full_name: req.body.full_name, id_document: (() => { 
                            const file = req.files?.find(file => file.fieldname === 'id_document') || req.file;
                            return file ? { name: file.originalname, type: file.mimetype, size: file.size, buffer: file.buffer } : null;
                        })() };
    const input = { body };

    const result = await KycService.store(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[KycController:store]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

exports.update = async (req, res) => {
  try {
    const body = { full_name: req.body.full_name, id_document: (() => { 
                            const file = req.files?.find(file => file.fieldname === 'id_document') || req.file;
                            return file ? { name: file.originalname, type: file.mimetype, size: file.size, buffer: file.buffer } : null;
                        })() };
    const params = { id: req.params.id };
    const input = { body, params };

    const result = await KycService.update(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[KycController:update]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const params = { id: req.params.id };
    const input = { params };

    const result = await KycService.delete(input, req.user);

    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[KycController:delete]', error);
    const status = error.statusCode || error.status || 500;
    return res.status(status).json({ error: true, message: error.message || 'Internal Server Error' });
  }
};

