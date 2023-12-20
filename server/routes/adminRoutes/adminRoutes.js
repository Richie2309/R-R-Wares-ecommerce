const express = require('express')
const route = express.Router();
const multer=require('../../controller/adminController/multer')

const adminRender = require('../../services/adminServices/adminRender');
const adminController = require('../../controller/adminController/adminController');
const adminAuthMiddleware = require('../../../middlewares/adminMiddleware/adminAuthMiddleware');

route.get('/adminSignin', adminAuthMiddleware.noAdminAuth, adminRender.adminSignin)

route.post('/adminSignin', adminController.adminSignin)

route.get('/adminHome', adminAuthMiddleware.isAdminAuth, adminRender.adminHome);

route.get('/adminProductManage', adminAuthMiddleware.isAdminAuth, adminRender.adminProductManage);

route.get('/adminAddProduct', adminAuthMiddleware.isAdminAuth, adminRender.adminAddProduct);
route.post('/adminAddProduct',  multer.store.array('images',4), adminController.adminAddProducts);

route.get('/adminUnlistedProduct', adminAuthMiddleware.isAdminAuth, adminRender.adminUnlistedProduct);

route.get('/adminCategoryManage', adminAuthMiddleware.isAdminAuth, adminRender.adminCategoryManage);

route.get('/adminAddCategory', adminAuthMiddleware.isAdminAuth, adminRender.adminAddCategory);
route.post('/adminAddCategory', adminController.adminAddCategory )

route.get('/adminUnlistedCategory', adminAuthMiddleware.isAdminAuth, adminRender.adminUnlistedCategory);
route.get('/adminUnlistedCategory/:id', adminAuthMiddleware.isAdminAuth, adminController.adminUnlistedCategory);

route.get('/adminRestoreCategory/:id', adminAuthMiddleware.isAdminAuth, adminController.adminRestoreCategory);

route.get('/adminUserManage', adminAuthMiddleware.isAdminAuth, adminRender.adminUserManage);

route.get('/adminUserStatus/:id/:block', adminAuthMiddleware.isAdminAuth, adminController.adminUserStatus);

route.get('/adminLogout', adminController.adminLogout)


//api 
route.post('/api/getAllUser', adminController.getAllUser);

route.get('/api/getProduct',adminController.showProduct)

route.post('/api/getCategory/:value', adminController.getCategory);

module.exports=route;