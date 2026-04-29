const Joi = require('joi');

const savings_contributeSchema = Joi.object({
  "account_id": Joi.number().integer().required(),
  "amount": Joi.number().required()
});

exports.savings_contribute = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = savings_contributeSchema.validate(dataToValidate, { abortEarly: false });

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

exports.show = (req, res, next) => {
  next();
};

const createSavingsSchema = Joi.object({
  "goalName": Joi.string().required(),
  "targetAmount": Joi.number().required(),
  "deadline": Joi.date().iso().required(),
  "descripption": Joi.string().required()
});

exports.createSavings = (req, res, next) => {
  const dataToValidate = { ...req.body };

  const { error, value } = createSavingsSchema.validate(dataToValidate, { abortEarly: false });

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

exports.delete = (req, res, next) => {
  next();
};

