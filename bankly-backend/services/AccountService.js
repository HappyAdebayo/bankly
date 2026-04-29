'use strict';

const db = require('../models');
const { generateSecurityCode } = require('../utils/security/codeGenerator');

/**
 * AccountService.js
 * Business logic for Account
 */

exports.withdraw = async (input, user) => {
  if (input.body.amount <= 0) {
    throw { status: 422, message: "amount must be greater than zero"};
  }

  const userAccount = await db.Account.findOne({
    where: { user_id: user.id },
  });

  if (userAccount.balance < input.body.amount) {
    throw { status: 422, message: "insuffiient fund"};
  }

  let userBalance = userAccount.balance - input.body.amount;

  const reference = generateSecurityCode({
    length: 10,
    charType: 'alphanumeric'
  });

  const withdrawalTransation = await db.sequelize.transaction();
  try {
    await db.Account.update({
      balance: userBalance
    }, {
      where: { user_id: user.id },
      transaction: withdrawalTransation
    });
    const newRecord = await db.Transactions.create({
      type: "withdrawal",
      amount: input.body.amount,
      status: "success",
      balance: userAccount.balance,
      user_id: user.id,
      reference: reference,
      to_account_id: userAccount.id,
      from_account_id: userAccount.id
    }, { transaction: withdrawalTransation });

    await withdrawalTransation.commit();
  } catch (transactionError) {
    await withdrawalTransation.rollback();
    throw transactionError;
  }

  return { status: 200, message: "withdrawal successful", data: {} };
};

exports.index = async (input, user) => {
  const userAccount = await db.Account.findOne({
    where: { user_id: user.id },
  });

  const where = { [db.Sequelize.Op.and]: [ { from_account_id: userAccount.id }, { to_account_id: userAccount.id } ] };
  const order = undefined;
  const page = Number(input.query?.page) || 1;
  const limit = Number(input.query?.limit) || 20;
  const offset = (page - 1) * limit;

  const transactionListResult = await db.Transactions.findAndCountAll({
    where,
    limit,
    offset,
    ...(order && { order }),
  });

  const transactionList = transactionListResult.rows;
  const transactionList_pagination = {
    total: transactionListResult.count,
    page,
    limit,
    totalPages: limit > 0 ? Math.ceil(transactionListResult.count / limit) : 1
  };

  const totalTransaction = await db.Transactions.count({
    where: { [db.Sequelize.Op.and]: [ { from_account_id: userAccount.id }, { to_account_id: userAccount.id } ] }
  });

  let transferSum = Number(0);

  let depositeSum = Number(0);

  let withdrawnSum = Number(0);

  for (const [trancitem, transaction] of transactionList.entries()) {
    if (transaction.type == "transfer") {
      transferSum += transaction.amount;

    } else if (transaction.type == "deposit") {
      depositeSum += transaction.amount;

    } else if (transaction.type == "withdrawal") {
      withdrawnSum += transaction.amount;

    }

  }

  return { status: 200, message: "User fetched sucessfully", data: { list: { data: transactionList, pagination: transactionList_pagination }, total_trasaction: totalTransaction, balance: userAccount.balance, total_deposited: depositeSum, total_transferred: transferSum, total_withdrawn: withdrawnSum } };
};

exports.transfer = async (input, user) => {
  if (input.body.amount <= 0) {
    throw { status: 422, message: "Amount is to be greater than 0"};
  }

  const usersAccount = await db.Account.findOne({
    where: { user_id: user.id },
  });

  if (input.body.to_account_number == usersAccount.account_number) {
    throw { status: 422, message: "Can't send money to your account"};
  }

  const receiverExist = await db.Account.findOne({
    where: { account_number: input.body.to_account_number },
  });

  if (!receiverExist) {
    throw { status: 404, message: "User not found"};
  }

  if (usersAccount.balance < input.body.amount) {
    throw { status: 422, message: "insufficient fund"};
  }

  let sendersBalance = usersAccount.balance - input.body.amount;

  let receiversBalance = receiverExist.balance + input.body.amount;

  const reference = generateSecurityCode({
    length: 10,
    charType: 'alphanumeric'
  });

  const transferTransaction = await db.sequelize.transaction();
  try {
    await db.Account.update({
      balance: sendersBalance
    }, {
      where: { user_id: usersAccount.user_id },
      transaction: transferTransaction
    });
    await db.Account.update({
      balance: receiversBalance
    }, {
      where: { user_id: receiverExist.user_id },
      transaction: transferTransaction
    });
    const newRecord = await db.Transactions.create({
      type: "transfer",
      amount: input.body.amount,
      status: "success",
      reference: reference,
      description: input.body.description,
      to_account_id: receiverExist.id,
      from_account_id: usersAccount.id
    }, { transaction: transferTransaction });

    await transferTransaction.commit();
  } catch (transactionError) {
    await transferTransaction.rollback();
    throw transactionError;
  }

  const receiversdata = await db.User.findOne({
    where: { id: receiverExist.user_id },
  });

  return { status: 201, message: "Transfer was successful", data: { receiverEmail: receiversdata.email, receiveracct: receiverExist.account_number } };
};

