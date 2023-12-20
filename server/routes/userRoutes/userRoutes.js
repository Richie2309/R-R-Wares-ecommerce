const express = require('express')
const route = express.Router()

const userRender = require('../../services/userServices/userRender');
const userController = require('../../controller/userController/userController');
const userAuthMiddleware = require('../../../middlewares/userMiddleware/userAuthMiddleware')

route.get('/', userAuthMiddleware.isUserBlocked, userRender.homepage)

route.get('/forHim', userRender.forHim)

route.get('/forHer', userRender.forHer)

route.get('/userSigninEmail', userAuthMiddleware.isUserAuth, userRender.userSigninEmail)
route.post('/userSigninEmail', userController.userSigninEmail)

route.get('/userSignupEmailVerify', userRender.userSignupEmailVerify)
route.post('/userSignupEmailVerify', userController.userSignupEmailVerify)

route.get('/userSignupOtpVerify', userRender.userSignupOtpVerify)
route.post('/userSignupOtpVerify', userController.userSignupOtpVerify)

route.get('/userSignupEmailVerifyResend', userController.userSignupEmailVerifyResend);


route.get('/userSignup', userRender.userSignup)
route.post('/userSignup', userController.userSignup);

route.get('/userEnterOtp', userRender.userEnterOtp)

route.get('/userForgotPass', userRender.userForgotPass)

route.get('/userResetPassword', userRender.userResetPassword)

route.get('/userLogout', userController.userLogout)



// route.post('/userSignup', userController.userSignup)


// route.post('/userSignupEmail', userController.userSignupEmail)

// route.post('/userSignupOtpVerify', userController.userSignupOtpVerify)


module.exports = route;