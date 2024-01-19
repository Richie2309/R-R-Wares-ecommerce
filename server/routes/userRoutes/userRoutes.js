const express = require('express')
const route = express.Router()

const userRender = require('../../services/userServices/userRender');
const userController = require('../../controller/userController/userController');
const userAuthMiddleware = require('../../../middlewares/userMiddleware/userAuthMiddleware')
const addressController = require('../../controller/addressController')
const cartController = require('../../controller/cartController')
const productController = require('../../controller/productController')
const orderController=require('../../controller/orderController')

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
route.post('/userForgotPass', userController.userForgotPass)

route.get('/userEnterOtp', userRender.userEnterOtp)
route.post('/userEnterOtp', userController.userEnterOtp)

route.get('/userForgotPassOtpResend', userController.userForgotPassOtpResend);

route.get('/userResetPassword', userRender.userResetPassword)
route.post('/userResetPassword', userController.userResetPassword)

route.get('/userLogout', userController.userLogout)










route.get('/userProfile', userAuthMiddleware.isUserBlocked, userAuthMiddleware.isUserAuth2, userRender.userProfile)

route.get('/userEditProfile', userAuthMiddleware.isUserBlocked, userAuthMiddleware.isUserAuth2, userRender.userEditProfile)
route.post('/userEditProfile', userAuthMiddleware.isUserBlocked, userAuthMiddleware.isUserAuth2, userController.userEditProfile)

route.get('/userAddress', userAuthMiddleware.isUserAuth2, userRender.userAddress)

route.get('/changeAddress', userAuthMiddleware.isUserAuth2, addressController.changeAddress)


route.get('/userAddAddress', userAuthMiddleware.isUserAuth2, userRender.userAddAddress)
route.post('/userAddAddress', userAuthMiddleware.isUserAuth2, addressController.userAddAddress)

route.get('/userEditAddress', userAuthMiddleware.isUserAuth2, userRender.userEditAddress)
route.post('/userEditAddress', userAuthMiddleware.isUserAuth2, addressController.userEditAddress)

route.get('/deleteAddress', userAuthMiddleware.isUserAuth2, addressController.deleteAddress)

route.get('/usersAddToCart', userAuthMiddleware.isUserAuth2, cartController.usersAddToCart)

route.get('/userCart', userAuthMiddleware.isUserAuth2, userRender.userCart)

route.get('/userDeleteCart', userAuthMiddleware.isUserAuth2, cartController.userDeleteCart)

route.get('/updateQuantity', userAuthMiddleware.isUserAuth2, cartController.updateQuantity)

route.get('/userCheckOut', userAuthMiddleware.isUserAuth2, userRender.userCheckout)

route.post('/userCheckOut', userAuthMiddleware.isUserAuth2, userController.userCheckout)

route.get('/orderSuccess', userAuthMiddleware.isUserAuth2, userRender.orderSuccess)

route.get('/userOrderHistory', userAuthMiddleware.isUserAuth2, userRender.userOrderHistory)

route.get('/userCancelOrder',userAuthMiddleware.isUserAuth2, orderController.userCancelOrder)

// //api
route.get('/api/productByCategory', productController.productByCategory);

route.get('/api/getProductDetail', productController.userProductDetail)

route.get('/api/getUserInfo', userController.userInfo)

route.get('/api/getAddress', addressController.addressInfo)

route.post('/api/getCartItems', cartController.getCartItems)

module.exports = route;