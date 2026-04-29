'use strict';

const db = require('../models');

/**
 * DashboardService.js
 * Business logic for Dashboard
 */

exports.index = async (input, user) => {
  const userDetails = await db.User.findOne({
    where: { id: user.id },
  });

  const accoutDetails = await db.Account.findOne({
    where: { user_id: user.id },
  });

  const kycDetails = await db.Kyc.findOne({
    where: { user_id: user.id },
  });

  const savingDetails = await db.Savings.findOne({
    where: { user_id: user.id },
  });

  const where = { [db.Sequelize.Op.or]: [ { from_account_id: accoutDetails.id }, { to_account_id: accoutDetails.id } ] };
  const order = [['createdAt', 'DESC']];
  const page = Number(input.query?.page) || 1;
  const limit = Number(input.query?.limit) || 4;
  const offset = (page - 1) * limit;

  const tansactionlistResult = await db.Transactions.findAndCountAll({
    where,
    limit,
    offset,
    ...(order && { order }),
  });

  const tansactionlist = tansactionlistResult.rows;
  const tansactionlist_pagination = {
    total: tansactionlistResult.count,
    page,
    limit,
    totalPages: limit > 0 ? Math.ceil(tansactionlistResult.count / limit) : 1
  };

  const recentTransaction = await db.Transactions.count({
    where: { [db.Sequelize.Op.or]: [ { from_account_id: accoutDetails.id }, { to_account_id: accoutDetails.id } ] }
  });

  const kycStatus = kycDetails?.status ?? "not created";

  const savingAmount = savingDetails?.savedAmount ?? 0;

  return { status: 200, message: "dashboard details retrieved", data: { userdetails: { email: userDetails.email }, transaction: { data: tansactionlist, pagination: tansactionlist_pagination }, kycStatus, savingBalance: savingAmount, transactionCount: recentTransaction, account: { acctNumber: accoutDetails.account_number, acctBalance: accoutDetails.balance } } };
};

