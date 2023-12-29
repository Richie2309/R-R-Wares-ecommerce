const express = require('express')
const route = express.Router()

const userRender = require('../../services/userServices/userRender');
const userController = require('../../controller/userController/userController');
const userAuthMiddleware = require('../../../middlewares/userMiddleware/userAuthMiddleware')

route.get('/', userAuthMiddleware.isUserBlocked, userRender.homepage)

route.get('/singleProductCategory', userAuthMiddleware.isUserBlocked, userRender.singleProductCategory)

route.get('/userProductDetail', userAuthMiddleware.isUserBlocked, userRender.userProductDetail)

route.get('/userSigninEmail', userAuthMiddleware.isUserAuth, userRender.userSigninEmail)
route.post('/userSigninEmail', userController.userSigninEmail)

route.get('/userSignupEmailVerify', userRender.userSignupEmailVerify)
route.post('/userSignupEmailVerify', userController.userSignupEmailVerify)

route.get('/userSignupOtpVerify', userRender.userSignupOtpVerify)
route.post('/userSignupOtpVerify', userController.userSignupOtpVerify)

route.get('/userSignupEmailVerifyResend', userController.userSignupEmailVerifyResend);

route.get('/userSignup', userRender.userSignup)
route.post('/userSignup', userController.userSignup);

route.get('/userForgotPass', userRender.userForgotPass)
route.post('/userForgotPass',userController.userForgotPass)

route.get('/userEnterOtp', userRender.userEnterOtp)
route.post('/userEnterOtp', userController.userEnterOtp)

route.get('/userForgotPassOtpResend', userController.userForgotPassOtpResend);

route.get('/userResetPassword', userRender.userResetPassword)
route.post('/userResetPassword', userController.userResetPassword)

route.get('/userLogout', userController.userLogout)


//
// route.get('/productByCategory',  userRender.productByCategory);
// //


// //api
route.get('/api/productByCategory', userController.productByCategory);

route.get('/api/getProductDetail',userController.userProductDetail)
module.exports = route;