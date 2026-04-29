'use strict';

const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./emailService');
const { generateSecurityCode } = require('../utils/security/codeGenerator');


const email_302 = require('../templates/emails/email_302');
const email_316 = require('../templates/emails/email_316');

/**
 * AuthService.js
 * Business logic for Auth
 */

exports.login = async (input) => {
  const foundUser = await db.User.findOne({
    where: { email: input.body.email },
  });

  if (!foundUser) {
    throw { status: 404, message: "User not found"};
  }

  const isPasswordValid = await bcrypt.compare(input.body.password, foundUser.password);

  if (!isPasswordValid) {
    throw { status: 401, message: "invalid password"};
  }

  const accessToken = jwt.sign({ id: foundUser.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

  return { status: 200, message: "user logged in successfully", data: { user: foundUser, token: accessToken } };
};

exports.store = async (input) => {
  const foundUser = await db.User.findOne({
    where: { email: input.body.email },
  });

  if (foundUser) {
    throw { status: 409, message: "User exist already"};
  }

  const hashedPassword = await bcrypt.hash(input.body.password, 10);

  const newUser = await db.User.create({
    email: input.body.email,
    password: hashedPassword
  });

  if (newUser) {
    await sendEmail({
      to: input.body.email,
      from: "Bankly@gmail.com",
      subject: "Welcome to bankly",
      html: email_302(input.body),
      provider: 'smtp'
    });

  }

  const accountNumber = generateSecurityCode({
    length: 10,
    charType: 'numeric'
  });

  const newRecord = await db.Account.create({
    status: "active",
    balance: 100000,
    user_id: newUser.id,
    account_number: accountNumber
  });

  return { status: 201, message: "User created successfully", data: {} };
};

exports.requestPasswordReset = async (input) => {
  const foundUser = await db.User.findOne({
    where: { email: input.body.email },
  });

  if (!foundUser) {
    throw { status: 404, message: "User not found" };
  }

  const resetPasswordOtp = generateSecurityCode({
    length: 8,
    charType: 'numeric'
  });

  await sendEmail({
    to: foundUser.email,
    from: "bankly@gmail.com",
    subject: "resetcode sent",
    html: email_316({ ...input.body, resetPasswordOtp }),
    provider: 'smtp'
  });

  const currentDateTime = new Date();

  const expiresAt = new Date(currentDateTime.getTime() + Number(5) * 60 * 1000);

  const newRecord = await db.PasswordResetTokens.create({
    code: resetPasswordOtp,
    used : "false",
    user_id: foundUser.id,
    expires_at: expiresAt
  });

  return { status: 200, message: "otp sent successfully", data: {} };
};

exports.createNewPassword = async (input) => {
  const foundCode = await db.PasswordResetTokens.findOne({
    where: { [db.Sequelize.Op.and]: [ { code: input.body.code }, { used : false } ] },
  });

  if (!foundCode) {
    throw { status: 404, message: "invalid or expired code"};
  }

  const currentDate = new Date();

  if (currentDate > foundCode.expires_at) {
    throw { status: 400, message: "Reset code expired"};
  }

  if (input.body.password != input.body.confirm_password) {
    throw { status: 422, message: "Password and confirm password do not match"};
  }

  const hashedPassword = await bcrypt.hash(input.body.password, 10);

  await db.User.update({
    password: hashedPassword
  }, {
    where: { id: foundCode.user_id },
  });
  await db.PasswordResetTokens.update({
    used : "true"
  }, {
    where: { user_id: foundCode.user_id },
  });
  return { status: 200, message: "Password updated successfuly", data: {} };
};

