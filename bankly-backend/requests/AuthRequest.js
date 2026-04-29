const Joi = require('joi');

const loginSchema = Joi.object({
  "email": Joi.string().email().required(),
  "password": Joi.string().min(10).required()
});

exports.login = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = loginSchema.validate(dataToValidate, { abortEarly: false });

  if (error) {
    return res.status(422).json({
      error: true,
      message: 'Validation failed',
      errors: error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }

  // Update req.body with mapped values (including file objects)
  req.body = value;
  next();
};

const storeSchema = Joi.object({
  "email": Joi.string().email().required(),
  "password": Joi.string().min(6).required()
});

exports.store = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = storeSchema.validate(dataToValidate, { abortEarly: false });

  if (error) {
    return res.status(422).json({
      error: true,
      message: 'Validation failed',
      errors: error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }

  // Update req.body with mapped values (including file objects)
  req.body = value;
  next();
};

const requestPasswordResetSchema = Joi.object({
  "email": Joi.string().email().required()
});

exports.requestPasswordReset = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = requestPasswordResetSchema.validate(dataToValidate, { abortEarly: false });

  if (error) {
    return res.status(422).json({
      error: true,
      message: 'Validation failed',
      errors: error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }

  // Update req.body with mapped values (including file objects)
  req.body = value;
  next();
};

const createNewPasswordSchema = Joi.object({
  "code": Joi.string().length(8).required(),
  "password": Joi.string().required(),
  "confirm_password": Joi.string().required()
});

exports.createNewPassword = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = createNewPasswordSchema.validate(dataToValidate, { abortEarly: false });

  if (error) {
    return res.status(422).json({
      error: true,
      message: 'Validation failed',
      errors: error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    });
  }

  // Update req.body with mapped values (including file objects)
  req.body = value;
  next();
};

