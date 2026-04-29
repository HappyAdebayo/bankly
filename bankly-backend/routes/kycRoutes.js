const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const KycRequest = require('../requests/KycRequest');
const userAuth = require('../middlewares/userAuth');
const KycController = require('../controllers/KycController');

router.get('/', userAuth, KycRequest.index, KycController.index);
router.get('/', userAuth, KycRequest.show, KycController.show);
router.post('/', userAuth, upload.any(), KycRequest.store, KycController.store);
router.put('/:id', userAuth, upload.any(), KycRequest.update, KycController.update);
router.delete('/:id', userAuth, KycRequest.delete, KycController.delete);

module.exports = router;
