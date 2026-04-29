const Joi = require('joi');

const withdrawSchema = Joi.object({
  "amount": Joi.number().positive().required()
});

exports.withdraw = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = withdrawSchema.validate(dataToValidate, { abortEarly: false });

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

exports.index = (req, res, next) => {
  next();
};

const transferSchema = Joi.object({
  "to_account_number": Joi.string().length(10).required(),
  "amount": Joi.number().required(),
  "description": Joi.string().required()
});

exports.transfer = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = transferSchema.validate(dataToValidate, { abortEarly: false });

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

