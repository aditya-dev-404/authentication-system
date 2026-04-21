
import express from 'express'
const router = express.Router();

import { isAuthenticated, login, logout, register, resetPass, sendPassResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authControllers.js';
import userAuth from '../middlewares/userAuth.js';

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-verify-otp', userAuth, sendVerifyOtp);
router.post('/verify-account', userAuth, verifyEmail);
router.get('/is-auth', userAuth, isAuthenticated);
router.post('/send-reset-otp', sendPassResetOtp);
router.post('/resetPassword', resetPass);


export default router;






// auth.routes.js
// router.post("/register", register);
// router.post("/login", login);
// router.post("/logout", logout);