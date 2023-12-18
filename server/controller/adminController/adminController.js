const adminEmail = `admin@gmail.com`;
const adminPassword = `123`;

const mongodb = require("mongoose");
const Userdb = require("../../model/userModel/userModel");
const Productdb = require('../../model/adminModel/productModel').productSchema
const UnlistedProductdb = require('../../model/adminModel/productModel').unlistedProductSchema


const fs = require("fs");
const path = require("path");


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

exports.adminAddProducts = async (req, res) => {
  const { pName, brand, category, pDescription, price, units } = req.body
  const files=req.file
    try {
      if (!pName) {
        req.session.pName = "This Field is required";
      }

      if (!pDescription) {
        req.session.pDescription = "This Field is required";
      }
      if (!category) {
        req.session.category = "This filed is requierd"
      }
      if (!price) {
        req.session.fPrice = "This Field is required";
      }
      if (!units) {
        req.session.units = "This Field is required";
      }
      if (req.files.length === 0) {
        req.session.files = "This Field is required";
      }

      if (
        req.session.pName ||
        req.session.pDescription ||
        req.session.category ||
        req.session.price ||
        req.session.units ||
        req.session.files
      ) {
        req.session.productInfo = req.body;
        return res.status(401).redirect("/adminAddProduct");
      }
      const uploadImg = files.map((value) => `/uploadedImages/${value.filename}`)
      const newProduct = new Productdb({
        pName: pName,
        brand: brand,
        category: category,
        pDescription: pDescription,
        price: price,
        units: units,
        images: uploadImg,
      })
      const data = await newProduct.save();
      res.redirect("/adminHome");
    }catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  exports.getAllUser= async (req, res) => {
    try {
      const result = await Userdb.find();
      res.send(result);
    } catch (err) {
      console.log(err);
      res.status(401).send('Internal server error');
    }
  }

  exports.adminUserStatus= async (req, res) => {
    if(!Number(req.params.block)){
      await Userdb.updateOne({_id: req.params.id}, {$set: {userStatus: false, userLstatus: false}});
      return res.status(200).redirect('/adminUserManage');
    }
    await Userdb.updateOne({_id: req.params.id}, {$set: {userStatus: true}});
    res.status(200).redirect('/adminUserManage');
  }