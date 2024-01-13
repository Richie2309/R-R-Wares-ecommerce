const express = require('express')
const route = express.Router()

const userRender = require('../../services/userServices/userRender');
const userController = require('../../controller/userController/userController');
const userAuthMiddleware = require('../../../middlewares/userMiddleware/userAuthMiddleware')

route.get('/', userAuthMiddleware.isUserBlocked, userRender.homepage)

route.get('/singleProductCategory', userAuthMiddleware.isUserBlocked, userRender.singleProductCategory)

route.get('/userProductDetail', userAuthMiddleware.isUserBlocked,  userRender.userProductDetail)

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










route.get('/userProfile', userAuthMiddleware.isUserBlocked,userAuthMiddleware.isUserAuth2, userRender.userProfile)

route.get('/userEditProfile', userAuthMiddleware.isUserBlocked, userAuthMiddleware.isUserAuth2,userRender.userEditProfile)
route.post('/userEditProfile', userAuthMiddleware.isUserBlocked,userAuthMiddleware.isUserAuth2, userController.userEditProfile)

route.get('/userAddress', userAuthMiddleware.isUserAuth2, userRender.userAddress)

route.get('/changeAddress', userAuthMiddleware.isUserAuth2, userController.changeAddress)


route.get('/userAddAddress', userAuthMiddleware.isUserAuth2, userRender.userAddAddress)
route.post('/userAddAddress', userAuthMiddleware.isUserAuth2, userController.userAddAddress)

route.get('/userEditAddress', userAuthMiddleware.isUserAuth2, userRender.userEditAddress)
route.post('/userEditAddress', userAuthMiddleware.isUserAuth2, userController.userEditAddress)

route.get('/deleteAddress', userAuthMiddleware.isUserAuth2, userController.deleteAddress)

route.get('/usersAddToCart',userAuthMiddleware.isUserAuth2,userController.usersAddToCart)

route.get('/userCart',userAuthMiddleware.isUserAuth2, userRender.userCart)

route.get('/userDeleteCart',userAuthMiddleware.isUserAuth2, userController.userDeleteCart)

route.get('/updateQuantity',userAuthMiddleware.isUserAuth2, userController.updateQuantity)

route.get('/userCheckOut', userAuthMiddleware.isUserAuth2, userRender.userCheckout)
// route.post('/userCheckOut', userController.userCheckout)


// //api
route.get('/api/productByCategory', userController.productByCategory);

route.get('/api/getProductDetail',userController.userProductDetail)

route.get('/api/getUserInfo',userController.userInfo)

route.get('/api/getAddress', userController.addressInfo)

route.post('/api/getCartItems',userController.getCartItems)

module.exports = route;