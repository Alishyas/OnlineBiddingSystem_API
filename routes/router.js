const controller = require('../controller/db');
const router = require('express').Router();

router.post('/login' , controller.login);
router.post('/signup' , controller.signup);
router.post('/createproduct' , controller.create);
router.post('/deleteproduct' , controller.deleteProduct);
router.post('/product' , controller.findProduct);
router.post('/updateproduct' , controller.updateProduct);
router.get('/getallproducts' , controller.getAllProducts);

module.exports = router;