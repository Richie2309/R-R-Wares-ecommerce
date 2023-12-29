const adminEmail = `admin@gmail.com`;
const adminPassword = `123`;

const mongodb = require("mongoose");
const Userdb = require("../../model/userModel/userModel");
const Productdb = require('../../model/adminModel/productModel')
const UnlistedProductdb = require('../../model/adminModel/productModel').unlistedProductSchema


const fs = require("fs");
const path = require("path");
const Categorydb = require("../../model/adminModel/categoryModel");


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


// Category management
exports.adminAddCategory = async (req, res) => {
  try {
    if (!req.body.name) {
      req.session.errMesg = `This field is required`
      return res.status(200).redirect('/adminAddCategory')
    }
    const categoryExists = await Categorydb.findOne({ category: req.body.name })
    if (categoryExists) {
      req.session.errMesg = "Category already exists"
      return res.status(200).redirect('/adminAddCategory')
    }
    const newCat = new Categorydb(req.body);
    const result = await newCat.save();
    res.status(200).redirect("/adminCategoryManage");
  } catch (err) {
    req.session.errMesg = `Category already exist `;
    res.status(401).redirect("/adminAddCategory");
  }
}

exports.getCategory = async (req, res) => {
  if (Number(req.params.value) === 1) {
    const result = await Categorydb.find({ status: true });
    res.send(result);
  } else {
    const result = await Categorydb.find({ status: false });
    res.send(result);
  }
}

exports.adminUnlistedCategory = async (req, res) => {
  await Categorydb.updateOne(
    { _id: req.params.id },
    { $set: { status: false } }
  );
  res.status(200).redirect("/adminCategoryManage");
}

exports.adminRestoreCategory = async (req, res) => {
  await Categorydb.updateOne(
    { _id: req.params.id },
    { $set: { status: true } }
  );
  res.status(200).redirect("/adminUnlistedCategory");
}

//Product Management
exports.adminAddProducts = async (req, res) => {
  const { pName, brand, category, pDescription, price, units } = req.body
  const files = req.files
  try {
    if (!pName) {
      req.session.pName = "This Field is required";
    }
    if (!brand) {
      req.session.brand = "This Field is required";
    }
    if (!pDescription) {
      req.session.pDescription = "This Field is required";
    }
    if (!category) {
      req.session.category = "This filed is requierd"
    }
    if (!price) {
      req.session.price = "This Field is required";
    }
    if (!units) {
      req.session.units = "This Field is required";
    }
    if (!files) {
      req.session.files = "This field is required"
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
      console.log('all fields are required')
      return res.status(401).redirect("/adminAddProduct");
    }
    // Extract filenames from the uploaded files
    const uploadImg = files.map((value) => { return "/uploads/" + value.filename });
    console.log(uploadImg)
    // Create a new product using the Productdb model
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
    console.log(data)
    res.redirect("/adminHome");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
}

exports.showProduct = async (req, res) => {
  try {
    if (Number(req.params.value) === 1) {
      const products = await Productdb.find({ listed: true })
      res.send(products);
    }
    else {
      const products = await Productdb.find({ listed: false })
      res.send(products)
    }
    // const products = await Productdb.find({ listed: (Number(req.params.value)) ? true : false })
    // res.send(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Internal server error');
  }
}

exports.singleProduct = async (req, res) => {
  try {
    const id = req.params.value
    const products = await Productdb.find({ _id: id })
    console.log(products);
    res.send(products);

    // const products = await Productdb.find({ listed: (Number(req.params.value)) ? true : false })
    // res.send(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Internal server error');
  }
}

exports.adminUnlistedProduct = async (req, res) => {
  try {
    await Productdb.updateOne(
      { _id: req.params.id },
      { $set: { listed: false } }
    )
    res.status(200).redirect("/adminProductManage")
  } catch (err) {
    console.error('Error deleting products:', err);
    res.status(500).send('Internal server error');
  }
}

exports.adminRestoreProduct = async (req, res) => {
  try {
    await Productdb.updateOne(
      { _id: req.params.id },
      { $set: { listed: true } }
    )
    res.status(200).redirect("/adminUnlistedProduct")
  } catch (err) {
    console.error('Error deleting products:', err);
    res.status(500).send('Internal server error');
  }
}

exports.adminUpdateProduct = async (req, res) => {
  const { pName, brand, category, pDescription, price, units } = req.body
  const files = req.files
  console.log(req.body);
  console.log(files);
  try {
    if (!pName) {
      req.session.pName = "This Field is required";
    }
    if (!brand) {
      req.session.brand = "This Field is required";
    }
    if (!pDescription) {
      req.session.pDescription = "This Field is required";
    }
    if (!category) {
      req.session.category = "This filed is requierd"
    }
    if (!price) {
      req.session.price = "This Field is required";
    }
    if (!units) {
      req.session.units = "This Field is required";
    }
    // if (req.files.length === 0) {
    //   req.session.files = "This Field is required";
    // }

    if (
      req.session.pName ||
      req.session.pDescription ||
      req.session.category ||
      req.session.price ||
      req.session.units
    ) {
      req.session.updateProductInfo = req.body;
      return res.send(`/adminUpdateProduct/${req.query.id}`);
    }
    const uploadImg = files.map((value) => { return "/uploads/" + value.filename });

    const updateProduct = {
      pName: pName,
      brand: brand,
      category: category,
      pDescription: pDescription,
      price: price,
      units: units,
      // images: uploadImg,
    }

    console.log("gg" + updateProduct);
    await Productdb.updateOne({ _id: req.params.id }, { $set: updateProduct });
    if (files.length == 0)
      return res.redirect('/adminProductManage')
    else {
      await Productdb.updateOne({ _id: req.params.id }, { $set: { images: uploadImg } })
      res.redirect("/adminProductManage");
    }

  } catch (err) {
    console.error('Error updating products:', err);
    res.status(500).send('Internal server error');
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