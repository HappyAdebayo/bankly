const express = require('express');
const router = express.Router();
const DashboardRequest = require('../requests/DashboardRequest');
const userAuth = require('../middlewares/userAuth');
const DashboardController = require('../controllers/DashboardController');

router.get('/', userAuth, DashboardRequest.index, DashboardController.index);

module.exports = router;
