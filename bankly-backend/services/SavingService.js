'use strict';

const db = require('../models');
const { generateSecurityCode } = require('../utils/security/codeGenerator');

/**
 * SavingService.js
 * Business logic for Saving
 */

exports.savings_contribute = async (input, user) => {
  if (input.body.amount <= 4) {
    throw { status: 422, message: "Amount must be greater than 0"};
  }

  const userSavings = await db.Savings.findOne({
    where: { id: input.params.id , user_id: user.id  },
  });

  if (!userSavings) {
    throw { status: 404, message: "savings not found"};
  }

  const userBalance = await db.Account.findOne({
    where: { id: input.body.account_id },
  });

  if (!userBalance) {
    throw { status: 400, message: "Error occurred"};
  }

  if (userBalance.balance < input.body.amount) {
    throw { status: 400, message: "Error occurred"};
  }

  let currentBalance = userBalance.balance - input.body.amount;

  let savingBalance = userSavings.savedAmount + input.body.amount;

  await db.Savings.update({
    savedAmount: savingBalance
  }, {
    where: { id: input.params.id , user_id: user.id  },
  });
  const reference = generateSecurityCode({
    length: 10,
    charType: 'alphanumeric'
  });

  await db.Account.update({
    balance: currentBalance
  }, {
    where: { user_id: user.id },
  });
  const newTransaction = await db.Transactions.create({
    type: "savings_contribution",
    amount: input.body.amount,
    status: "success",
    reference: reference,
    savings_id: userSavings.id,
    description: "",
    to_account_id: userBalance.id,
    from_account_id: userBalance.id
  });

  return { status: 200, message: "Saved successfully", data: { amount: userBalance.balance, reference } };
};

exports.index = async (input, user) => {
  const saving_list = await db.Savings.findOne({
    where: { user_id: user.id },
  });

  const accountDetails = await db.Account.findOne({
    where: { id: saving_list.account_id },
  });

  return { status: 200, message: "Savings fetched successfully", data: { savingbalance: saving_list.savedAmount, mainBalance: accountDetails.balance, goalTarget: saving_list.targetAmount, savings: saving_list } };
};

exports.show = async (input, user) => {
  const savingFound = await db.Savings.findOne({
    where: { id: input.params.id , user_id: user.id  },
  });

  if (!savingFound) {
    throw { status: 404, message: "Savings not found"};
  }

  const where = { id: input.params.id , savings_id: input.params.id  };
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

  return { status: 200, message: "user list fetched sucessfully", data: { savings: savingFound, list: { data: transactionList, pagination: transactionList_pagination } } };
};

exports.createSavings = async (input, user) => {
  if (input.body.targetAmount <= "0") {
    throw { status: 422, message: "target amount should begreater than 0"};
  }

  const userAcount = await db.Account.findOne({
    where: { user_id: user.id },
  });

  const newSavings = await db.Savings.create({
    user_id: user.id,
    deadline: input.body.deadline,
    goalName: input.body.goalName,
    account_id: userAcount.id,
    savedAmount: 0,
    descripption: input.body.descripption,
    targetAmount: input.body.targetAmount
  });

  return { status: 201, message: "Savings created successfully", data: { savings: newSavings } };
};

exports.delete = async (input, user) => {
  const userSaving = await db.Savings.findOne({
    where: { id: input.params.id , user_id: user.id  },
  });

  if (!userSaving) {
    throw { status: 404, message: "Savings not found"};
  }

  if (userSaving.savedAmount > 0) {
    const userBalance = await db.Account.findOne({
      where: { id: input.params.id , user_id: user.id  },
    });

    let currentBalance = userSaving.savedAmount + userBalance.balance;

    await db.Account.update({
      balance: currentBalance
    }, {
      where: { id: input.params.id , user_id: user.id  },
    });
    const reference = generateSecurityCode({
      length: 10,
      charType: 'alphanumeric'
    });

    const newRecord = await db.Transactions.create({
      type: "deposit",
      amount: userSaving.savedAmount,
      status: "success",
      reference: reference,
      description: "money moved from savings account",
      to_account_id: userBalance.id,
      from_account_id: userBalance.id
    });

  }

  const deleteSaving = await db.Savings.update(
    { deletedAt: new Date() },
    { where: { id: input.params.id , user_id: userSaving.user_id  } }
  );

  return { status: 200, message: "savings deleted successfully", data: { savingdetails: userSaving } };
};

