const express = require('express');
const router = express.Router();
const AccountRequest = require('../requests/AccountRequest');
const userAuth = require('../middlewares/userAuth');
const AccountController = require('../controllers/AccountController');

router.post('/withdraw', userAuth, AccountRequest.withdraw, AccountController.withdraw);
router.get('/', userAuth, AccountRequest.index, AccountController.index);
router.post('/transfer', userAuth, AccountRequest.transfer, AccountController.transfer);

module.exports = router;
