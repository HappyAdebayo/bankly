'use strict';

const db = require('../models');
const fs = require('fs').promises;
const path = require('path');

/**
 * KycService.js
 * Business logic for Kyc
 */

exports.index = async (input, user) => {
  const kycStatus = await db.Kyc.findOne({
    where: { user_id: user.id },
  });

  return { status: 200, message: "kyc retrieved successfully", data: { status: kycStatus.status } };
};

exports.show = async (input, user) => {
  if (!input.params.id) {
    throw { status: 422, message: "param not found"};
  }

  const foundKyc = await db.Kyc.findOne({
    where: { id: input.params.id , user_id: user.id  },
  });

  if (!foundKyc) {
    throw { status: 404, message: "Kyc not found"};
  }

  return { status: 200, message: "Kyc fetched succesfully", data: { kyvdetails: foundKyc } };
};

exports.store = async (input, user) => {
  const kycExist = await db.Kyc.findOne({
    where: { user_id: user.id },
  });

  if (kycExist) {
    throw { status: 400, message: "KYC already submitted"};
  }

  // File Store: Inline Local Storage
  await fs.mkdir(path.join(process.cwd(), 'assets', "kyc"), { recursive: true });
  await fs.writeFile(path.join(process.cwd(), 'assets', "kyc", input.body.id_document.name), input.body.id_document.buffer);
  const kyc = { 
    path: path.join('assets', "kyc", input.body.id_document.name),
    name: input.body.id_document.name
  };

  const kycCreated = await db.Kyc.create({
    user_id: user.id,
    full_name: input.body.full_name,
    id_document: input.body.id_document.name,
     id_document: input.body. id_document.name
  });

  return { status: 201, message: "Kyc created successfully", data: { kycData: kycCreated } };
};

exports.update = async (input, user) => {
  if (!input.params.id) {
    throw { status: 422, message: "no param id given"};
  }

  const kycExist = await db.Kyc.findOne({
    where: { id: input.params.id , user_id: user.id  },
  });

  if (!kycExist) {
    throw { status: 404, message: "kyc not found"};
  }

  if (input.body. id_document.name) {
    // File Store: Inline Local Storage
    await fs.mkdir(path.join(process.cwd(), 'assets', "kyc"), { recursive: true });
    await fs.writeFile(path.join(process.cwd(), 'assets', "kyc", input.body. id_document.name.name), input.body. id_document.name.buffer);
  }

  await db.Kyc.update({
    full_name: input.body.full_name,
     id_document: input.body.full_name
  }, {
    where: { id: input.params.id , user_id: user.id  },
  });
  return { status: 200, message: "kyc updated successfully", data: {} };
};

exports.delete = async (input, user) => {
  if (!input.params.id) {
    throw { status: 422, message: "param does not exist"};
  }

  const kycExist = await db.Kyc.findOne({
    where: { id: input.params.id },
  });

  if (!kycExist) {
    throw { status: 404, message: "Kyc not found"};
  }

  // File Delete: Inline Local Storage
  await fs.rm(path.resolve(process.cwd(), 'assets', "kyc", kycExist. id_document.name), { force: true }).catch(() => {});

  await db.Kyc.destroy({
    where: { id: input.params.id , user_id: user.id  }
  });

  return { status: 200, message: "Kyc deleted successfully", data: {} };
};

