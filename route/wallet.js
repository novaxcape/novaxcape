const router = require('express').Router();
const { getOne } = require('../controller/wallet');
const {authenticateToken, vendorAuth} = require('../middleware/auth');

router.get('/', authenticateToken, vendorAuth,getOne);

module.exports = router;