const Joi = require('joi');

exports.index = (req, res, next) => {
  next();
};

exports.show = (req, res, next) => {
  next();
};

const storeSchema = Joi.object({
  "full_name": Joi.string().required(),
  "id_document": Joi.object({
      originalname: Joi.string(),
      mimetype: Joi.string().valid("application/pdf", "image/png"),
      size: Joi.number()
    }).unknown().custom((value, helpers) => {
      if (value && value.size) {
        if (value.size < 1048576) return helpers.message('File size must be at least 1MB');
        if (value.size > 5242880) return helpers.message('File size must not exceed 5MB');
      }
      return value;
    }).required()
});

exports.store = (req, res, next) => {
  const dataToValidate = { ...req.body };

  if (req.files && Array.isArray(req.files)) {
    req.files.forEach(file => {
      if (dataToValidate[file.fieldname]) {
        if (Array.isArray(dataToValidate[file.fieldname])) {
          dataToValidate[file.fieldname].push(file);
        } else {
          dataToValidate[file.fieldname] = [dataToValidate[file.fieldname], file];
        }
      } else {
        dataToValidate[file.fieldname] = file;
      }
    });
  } else if (req.file) {
    dataToValidate[req.file.fieldname] = req.file;
  }

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

const updateSchema = Joi.object({
  "full_name": Joi.string().optional(),
  "id_document": Joi.object({
      originalname: Joi.string(),
      mimetype: Joi.string().valid("application/pdf", "image/jpeg", "image/png"),
      size: Joi.number()
    }).unknown().custom((value, helpers) => {
      if (value && value.size) {
        
        if (value.size > 10485760) return helpers.message('File size must not exceed 10MB');
      }
      return value;
    }).optional()
});

exports.update = (req, res, next) => {
  const dataToValidate = { ...req.body };

  if (req.files && Array.isArray(req.files)) {
    req.files.forEach(file => {
      if (dataToValidate[file.fieldname]) {
        if (Array.isArray(dataToValidate[file.fieldname])) {
          dataToValidate[file.fieldname].push(file);
        } else {
          dataToValidate[file.fieldname] = [dataToValidate[file.fieldname], file];
        }
      } else {
        dataToValidate[file.fieldname] = file;
      }
    });
  } else if (req.file) {
    dataToValidate[req.file.fieldname] = req.file;
  }

  const { error, value } = updateSchema.validate(dataToValidate, { abortEarly: false });

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

