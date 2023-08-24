import express from 'express';
import validate from 'express-validation';
import userParams from '../params/user.params';
import users from'../beans/user';

const router = express.Router();


router.post('/usercre', validate(userParams.reset_password), users.c_user);
router.get('/userlogin', users.login_user);
router.post('/forget-password', users.forget_password);
router.get('/reset-password', validate(userParams.reset_password), users.reset_password);

router.get('/chenge-password', users.chenge_password);

module.exports = router;

