const adminEmail = `admin@gmail.com`;
const adminPassword = `123`;

const mongodb = require("mongoose");
const Userdb = require("../../model/userModel/userModel");
const Productdb = require('../../model/adminModel/productModel')
const UnlistedProductdb = require('../../model/adminModel/productModel').unlistedProductSchema


const fs = require("fs");
const path = require("path");
const Categorydb = require("../../model/adminModel/categoryModel");
const session = require("express-session");


//Sign in and out
exports.adminLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/adminSignin');
  });
};

exports.adminSignin = (req, res) => {
  if (!req.body.email) {
    req.session.adminEmail = `This Field is required`
  }

  if (!req.body.password) {
    req.session.adminPassword = `This Field is required`
  }

  if (req.body.email && !/^[A-Za-z0-9]+@gmail\.com$/.test(req.body.email)) {
    req.session.adminEmail = `Not a valid Gmail address`
  }

  if (req.session.adminEmail || req.session.adminPassword) {
    return res.status(401).redirect('/adminSignin');
  }
  if (req.body.password === adminPassword && req.body.email === adminEmail) {
    req.session.isAdminAuth = true;
    res.status(200).redirect("/adminHome"); //Login Sucessfull
  } else {
    req.session.invalidAdmin = `Invalid credentials!`;
    res.status(401).redirect("/adminSignin"); //Wrong Password or email
  }
}


//User Management
exports.getAllUser = async (req, res) => {
  try {
    const result = await Userdb.find();
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(401).send('Internal server error');
  }
}

exports.adminUserStatus = async (req, res) => {
  if (!Number(req.params.block)) {
    await Userdb.updateOne({ _id: req.params.id }, { $set: { userStatus: false, userLstatus: false } });
    return res.status(200).redirect('/adminUserManage');
  }
  await Userdb.updateOne({ _id: req.params.id }, { $set: { userStatus: true } });
  res.status(200).redirect('/adminUserManage');
}