const express = require('express')
const route = express.Router();
const multer=require('../../controller/adminController/multer')

const adminAuthMiddleware = require('../../../middlewares/adminMiddleware/adminAuthMiddleware');
const adminRender = require('../../services/adminServices/adminRender');
const adminController = require('../../controller/adminController/adminController');

//Sgn in and out
route.get('/adminSignin', adminAuthMiddleware.noAdminAuth, adminRender.adminSignin)

route.post('/adminSignin', adminController.adminSignin)

route.get('/adminLogout', adminController.adminLogout)

route.get('/adminHome', adminAuthMiddleware.isAdminAuth, adminRender.adminHome);

// Product MAnage//
route.get('/adminProductManage', adminAuthMiddleware.isAdminAuth, adminRender.adminProductManage);

route.get('/adminAddProduct', adminAuthMiddleware.isAdminAuth, adminRender.adminAddProduct);
route.post('/adminAddProduct',  multer.store.array('images',4), adminController.adminAddProducts);

route.get('/adminUnlistedProduct', adminAuthMiddleware.isAdminAuth, adminRender.adminUnlistedProduct );
route.get('/adminUnlistedProduct/:id', adminAuthMiddleware.isAdminAuth, adminController.adminUnlistedProduct);
 
route.get('/adminRestoreProduct/:id', adminAuthMiddleware.isAdminAuth, adminController.adminRestoreProduct);

route.get('/adminUpdateProduct/:id', adminAuthMiddleware.isAdminAuth, adminRender.adminUpdateProduct)
route.post('/adminUpdateProduct/:id',  multer.store.array('images',4), adminAuthMiddleware.isAdminAuth, adminController.adminUpdateProduct)

//Category Manage
route.get('/adminCategoryManage', adminAuthMiddleware.isAdminAuth, adminRender.adminCategoryManage);

route.get('/adminAddCategory', adminAuthMiddleware.isAdminAuth, adminRender.adminAddCategory);
route.post('/adminAddCategory', adminController.adminAddCategory)

route.get('/adminUnlistedCategory', adminAuthMiddleware.isAdminAuth, adminRender.adminUnlistedCategory)
route.get('/adminUnlistCategory/:id', adminAuthMiddleware.isAdminAuth, adminController.adminUnlistedCategory)

route.get('/adminRestoreCategory/:id', adminAuthMiddleware.isAdminAuth, adminController.adminRestoreCategory);

route.get('/adminUpdateCategory', adminAuthMiddleware.isAdminAuth, adminRender.adminUpdateCategory)
route.post('/adminUpdateCategory',  adminAuthMiddleware.isAdminAuth, adminController.adminUpdateCategory)

//User Manage
route.get('/adminUserManage', adminAuthMiddleware.isAdminAuth, adminRender.adminUserManage);

route.get('/adminUserStatus/:id/:block', adminAuthMiddleware.isAdminAuth, adminController.adminUserStatus);


//api 
route.post('/api/getAllUser', adminController.getAllUser);

route.get('/api/getProduct/:value',adminController.showProduct)

route.get('/api/singleProduct/:value', adminController.singleProduct);

route.get('/api/getSingleCategory',adminController.singleCategory)

route.post('/api/getCategory/:value', adminController.getCategory);


module.exports=route;