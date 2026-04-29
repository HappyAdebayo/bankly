const express = require('express');
const router = express.Router();

const dashboardRoutes = require('./dashboardRoutes');
const kycRoutes = require('./kycRoutes');
const savingRoutes = require('./savingRoutes');
const accountRoutes = require('./accountRoutes');
const authRoutes = require('./authRoutes');

router.use('/dashboard', dashboardRoutes);
router.use('/kyc', kycRoutes);
router.use('/savings', savingRoutes);
router.use('/accounts', accountRoutes);
router.use('/auth', authRoutes);

module.exports = router;
