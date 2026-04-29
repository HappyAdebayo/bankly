const express = require('express');
const router = express.Router();
const SavingRequest = require('../requests/SavingRequest');
const userAuth = require('../middlewares/userAuth');
const SavingController = require('../controllers/SavingController');

router.post('/contribute', userAuth, SavingRequest.savings_contribute, SavingController.savings_contribute);
router.get('/', userAuth, SavingRequest.index, SavingController.index);
router.get('/:id', userAuth, SavingRequest.show, SavingController.show);
router.post('/', userAuth, SavingRequest.createSavings, SavingController.createSavings);
router.delete('/:id', userAuth, SavingRequest.delete, SavingController.delete);

module.exports = router;
