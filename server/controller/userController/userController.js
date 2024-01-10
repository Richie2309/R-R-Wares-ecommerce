const Userdb = require('../../model/userModel/userModel');
const Otpdb = require("../../model/userModel/otpModel");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { default: mongoose } = require("mongoose");
const Categorydb = require('../../model/adminModel/categoryModel')
const Cartdb = require('../../model/userModel/cartModel')
const Productdb = require('../../model/adminModel/productModel');
const { query } = require('express');
const userAddressdb = require('../../model/userModel/addressModel')
// const dotenv = config({ path: 'congif.env' })

function capitalizeFirstLetter(str) {
  str = str.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const deleteOtpFromdb = async (_id) => {
  await Otpdb.deleteOne({ _id });
};

const otpGenrator = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};


const sendOtpMail = async (req, res, getRoute) => {

  const otp = otpGenrator();
  console.log(otp);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "R&R Wares",
      link: "https://mailgen.js/",
      logo: "R&R Wares",
    },
  });

  const response = {
    body: {
      name: req.session.verifyEmail,
      intro: "Your OTP for R&R Wares verification is:",
      table: {
        data: [
          {
            OTP: otp,
          },
        ],
      },
      outro: "✅",
    },
  };

  const mail = MailGenerator.generate(response);

  const message = {
    from: process.env.AUTH_EMAIL,
    to: req.session.verifyEmail,
    subject: "R&R Wares OTP Verification",
    html: mail,
  };

  try {
    const newOtp = new Otpdb({
      email: req.session.verifyEmail,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000,
    });
    const data = await newOtp.save();
    req.session.otpId = data._id;
    res.status(200).redirect(getRoute);
    await transporter.sendMail(message);
  } catch (err) {
    console.log(err);
  }
};

const userOtpVerify = async (req, res, getRoute) => {
  try {
    const data = await Otpdb.findOne({ _id: req.session.otpId });

    if (!data) {
      req.session.err = "OTP Expired";
      req.session.rTime = "0";
      return res.status(401).redirect(getRoute);
    }

    if (data.expiresAt < Date.now()) {
      req.session.err = "OTP Expired";
      req.session.rTime = "0";
      deleteOtpFromdb(req.session.otpId);
      return res.status(401).redirect(getRoute);
    }

    if (data.otp != req.body.otp) {
      req.session.err = "Wrong OTP";
      req.session.rTime = req.body.rTime;
      return res.status(401).redirect(getRoute);
    }

    return true;
  } catch (err) {
    console.log("Function error", err);
    res.status(500).send("Error while quering data err:");
  }
};

exports.userSignupEmailVerify = async (req, res) => {
  try {
    if (!req.body.email) {
      req.session.isUser = `This Field is required`
    }

    if (req.body.email && !/^[A-Za-z0-9]+@gmail\.com$/.test(req.body.email)) {
      req.session.isUser = `Not a valid Gmail address`
    }

    if (req.session.isUser) {
      return res.status(401).redirect('/userSignupEmailVerify');
    }

    const data = await Userdb.findOne({ email: req.body.email });

    if (data) {
      req.session.isUser = `Email already in use`;
      return res.status(401).redirect("/userSignupEmailVerify");
    }

    req.session.verifyOtpPage = true;
    req.session.verifyEmail = req.body.email;

    await sendOtpMail(req, res, "/userSignupOtpVerify"); // send otp as mail
  } catch (err) {
    console.log("Error querying the database:", err);
    res.status(500).send("Internal server error");
  }
}


exports.userSignupOtpVerify = async (req, res) => {
  try {
    if (!req.body.otp) {
      req.session.err = `This Field is required`;
    }
    if (req.session.err) {
      req.session.rTime = req.body.rTime;
      return res.status(200).redirect("/userSignupOtpVerify");
    }
    const response = await userOtpVerify(req, res, "/userSignupOtpVerify");

    if (response) {
      deleteOtpFromdb(req.session.otpId);
      req.session.verifyRegisterPage = true;
      res.status(200).redirect("/userSignup");
    }
  } catch (err) {
    console.log("Internal delete error", err);
    res.status(500).send("Error while quering data err:");
  }
}

exports.userSignupEmailVerifyResend = async (req, res) => {
  try {
    deleteOtpFromdb(req.session.otpId);
    sendOtpMail(req, res, "/userSignupOtpVerify");

    delete req.session.err;
    delete req.session.rTime;
  } catch (err) {
    console.log("Resend Mail err:", err);
  }
}

exports.userSignup = async (req, res) => {
  const userInfo = {};
  let { fname, password, reenterpassword } = req.body
  console.log('body', req.body);
  if (!fname || !/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(fname)) {
    req.session.fName = `This Field is required`;
  }
  else {
    userInfo.fName = req.body.fullName;
  }
  if (!password) {
    req.session.pass = `This Field is required`;
  }
  if (!reenterpassword) {
    req.session.conPass = `This Field is required`;
  }
  if (req.body.password != req.body.reenterpassword) {
    req.session.bothPass = `Both Passwords doesn't match`;
  }

  if (req.session.fName || req.session.pass || req.session.conPass || req.session.bothPass) {
    req.session.userSignup = userInfo;
    return res.status(401).redirect('/userSignup');
  }

  const fullname = req.body.fname
  if (req.body.password === req.body.reenterpassword) {
    const hashedPass = bcrypt.hashSync(req.body.password, 10);

    try {
      const newUser = new Userdb({
        fullName: fullname,
        email: req.session.verifyEmail,
        password: hashedPass,
        userStatus: true
      });
      await newUser.save();
      delete req.session.verifySignupPage;
      res.status(401).redirect("/userSigninEmail");
    } catch (err) {
      console.log(err);
      req.session.userRegister = userInfo;
      res.status(401).redirect("/userSignup");
    }
  }
}

exports.userSigninEmail = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await Userdb.findOne({ email: email })

    if (!req.body.email) {
      req.session.email = `This Field is required`;
    }
    if (!req.body.password) {
      req.session.pass = `This Field is required`;
    }
    if (req.session.email || req.session.pass) {
      return res.status(401).redirect('/userSigninEmail');
    }

    const data = await Userdb.findOne({ email: req.body.email });

    if (data) {
      if (bcrypt.compareSync(req.body.password, data.password)) {
        if (!data.userStatus) {
          req.session.userBlockedMesg = true;
          return res.status(200).redirect("/userSigninEmail");
        }
        req.session.isUserAuth = data._id; // temp
        res.status(200).redirect("/"); //Login Sucessfull
        await Userdb.updateOne(
          { _id: data._id },
          { $set: { userLstatus: true } }
        );
      } else {
        req.session.wrongPass = `Invalid Password`
        req.session.userInfo = req.body.email;
        req.session.invalidUser = `Invalid credentials!`;
        res.status(401).redirect("/userSigninEmail"); //Wrong Password or email
      }
    } else {
      req.session.invalidUser = `No user with that email`;
      res.status(401).redirect("/userSigninEmail"); //No user Found server err
    }
  } catch (err) {
    req.session.invalidUser = true;
    res.status(401).redirect("/userSigninEmail");
  }
}

exports.userForgotPass = async (req, res) => {
  try {
    if (!req.body.email) {
      req.session.isUser = `This Field is required`
    }

    if (req.body.email && !/^[A-Za-z0-9]+@gmail\.com$/.test(req.body.email)) {
      req.session.isUser = `Not a valid Gmail address`
    }

    if (req.session.isUser) {
      return res.status(401).redirect('/userForgotPass');
    }

    const data = await Userdb.findOne({ email: req.body.email });

    if (!data) {
      req.session.isUser = "Email not found"
      res.status(401).redirect('/userForgotPass')
    }

    req.session.verifyEmail = req.body.email;

    await sendOtpMail(req, res, '/userEnterOtp')

  } catch (err) {
    res.status(401).redirect('/userForgotPass')
  }
}

exports.userEnterOtp = async (req, res) => {
  try {
    if (!req.body.otp) {
      req.session.err = `This Field is required`;
    }
    if (req.session.err) {
      req.session.rTime = req.body.rTime;
      return res.status(200).redirect("/userEnterOtp");
    }
    const response = await userOtpVerify(req, res, "/userEnterOtp");
    if (response) {
      deleteOtpFromdb(req.session.otpId);
      req.session.verifyFogotPassPage = true;
      res.status(200).redirect("/userResetPassword");
    }
  } catch (err) {
    console.log(err);
  }
}

exports.userForgotPassOtpResend = async (req, res) => {
  try {
    deleteOtpFromdb(req.session.otpId);
    sendOtpMail(req, res, "/userEnterOtp");

    delete req.session.err;
    delete req.session.rTime;
  } catch (err) {
    console.log("Resend Mail err:", err);
  }
}

exports.userResetPassword = async (req, res) => {
  try {
    let { newPass, reenterNewPass } = req.body

    if (!newPass) {
      req.session.pass = `This Field is required`;
      return res.redirect('/userResetPassword')
    }
    if (!reenterNewPass) {
      req.session.conPass = `This Field is required`;
      return res.redirect('/userResetPassword')

    }
    if (newPass != reenterNewPass) {
      req.session.bothPass = `Both Passwords doesn't match`;
      return res.status(401).redirect('/userResetPassword');
    }
    if (newPass === reenterNewPass) {
      const hashedPass = bcrypt.hashSync(newPass, 10);

      await Userdb.updateOne(
        { email: req.session.verifyEmail },
        { $set: { password: hashedPass } }
      )
      res.status(200).redirect('/userSigninEmail')
    }


  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }

}

exports.userLogout = async (req, res) => {
  await Userdb.updateOne(
    { _id: req.session.isUserAuth },
    { $set: { userLstatus: false } }
  );

  req.session.destroy();

  res.status(200).redirect("/");
}

exports.productByCategory = async (req, res) => {
  const category = req.query.name
  console.log(category);
  try {

    const result = await Productdb.find({ category: category, listed: true });
    res.send(result);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).render("errorPages");
  }
}

exports.userProductDetail = async (req, res) => {
  const productId = req.query.productId
  try {
    const result = await Productdb.find({ _id: productId })
    res.send(result)
  } catch (err) {
    console.log(err);
  }
}

//----PROFILE----//
exports.userInfo = async (req, res) => {
  const userId = req.query.userId
  try {
    const result = await Userdb.findOne({ _id: userId })
    res.send(result)
  } catch (err) {
    console.log(err);
  }
}

exports.userEditProfile = async (req, res) => {
  try {
    if (!req.body.fName) {
      req.session.fName = `This Field is required`;
    }
    if (req.body.oldPass || req.body.newPass || req.body.conNewPass) {
      if (!req.body.oldPass) {
        req.session.oldPass = `This Field is required`;
      }

      if (!req.body.newPass) {
        req.session.newPass = `This Field is required`;
      }

      if (!req.body.conNewPass) {
        req.session.conNewPass = `This Field is required`;
      }

      if (req.body.newPass !== req.body.conNewPass) {
        req.session.conNewPass = `Both Password doesn't Match`;
      }
    }
    if (req.body.oldPass && req.body.newPass && req.body.conNewPass) {
      const userInfo = await Userdb.findOne({ _id: req.session.isUserAuth });
      if (!bcrypt.compareSync(req.body.oldPass, userInfo.password)) {
        req.session.oldPass = `Incorrect Password`;
      }
    }

    if (
      req.session.fName ||
      req.session.email ||
      req.session.oldPass ||
      req.session.newPass ||
      req.session.conNewPass
    ) {
      req.session.savedInfo = {
        fName: req.body.fName,
      };
      return res.status(401).redirect("/userEditProfile");
    }
    if (req.body.oldPass) {
      const hashedPass = bcrypt.hashSync(req.body.newPass, 10);

      const User = {
        fullName: req.body.fName,
        password: hashedPass,
      };
      await Userdb.updateOne(
        { _id: req.session.isUserAuth },
        { $set: User }
      );
    } else {
      const User = {
        fullName: req.body.fName,
      };
      await Userdb.updateOne(
        { _id: req.session.isUserAuth },
        { $set: User }
      );
    }
    res.status(200).redirect("/userProfile");
  } catch (err) {
    console.log(err);
  }
}


//----ADDRESS----//
exports.addressInfo = async (req, res) => {
  const userId = req.query.userId;
  const addressId = req.query.addressId;
  try {
    if (!addressId) {
      const address = await userAddressdb.findOne({
        "userId": userId
      }).populate('defaultAddress');
      res.send(address);
    }
    else {
      const address = await userAddressdb.findOne({
        "userId": userId
      })
      const oneAdd = address.address.find(element => {
        return String(element._id) === addressId
      })
      console.log(oneAdd);
      res.send(oneAdd);
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("internal server error");
  }
}

exports.changeAddress = async (req, res) => {
  try {
    await userAddressdb.updateOne(
      { userId: req.session.isUserAuth },
      { $set: { defaultAddress: req.query.id } }
    );
    res.status(200).redirect("/userAddress");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
}

exports.userAddAddress = async (req, res) => {
  try {
    if (!req.body.fName) {
      req.session.fName = `This Field is required`;
    }

    if (!req.body.pincode) {
      req.session.pincode = `This Field is required`;
    }

    if (!req.body.locality) {
      req.session.locality = `This Field is required`;
    }

    if (!req.body.address) {
      req.session.address = `This Field is required`;
    }

    if (!req.body.district) {
      req.session.district = `This Field is required`;
    }

    if (!req.body.state) {
      req.session.state = `This Field is required`;
    }

    if (
      req.session.fName ||
      req.session.pincode ||
      req.session.locality ||
      req.session.address ||
      req.session.district ||
      req.session.state
    ) {
      req.session.sAddress = req.body;
      return res.status(401).redirect("/userAddAddress");
    }

    req.body.fullName = capitalizeFirstLetter(req.body.fName);
    req.body.locality = capitalizeFirstLetter(req.body.locality);
    req.body.district = capitalizeFirstLetter(req.body.district);
    req.body.state = capitalizeFirstLetter(req.body.state);

    const isAddress = await userAddressdb.findOne({
      userId: req.session.isUserAuth,
      "address.fName": req.body.fName,
      "address.pincode": req.body.pincode,
      "address.locality": req.body.locality,
      "address.address": req.body.address,
      "address.district": req.body.district,
      "address.state": req.body.state,
    });

    if (isAddress) {
      req.session.exist = `This address already exist`;
      return res.status(401).redirect("/userAddAddress");
    }
    console.log('req.body:', req.body);
    console.log('req.query.addressId:', req.query.addressId);

    const structuredAddress = `${req.body.fName}, ${req.body.address}, ${req.body.locality}, ${req.body.district}, ${req.body.state} - ${req.body.pincode}`;

    await userAddressdb.updateOne(
      { userId: req.session.isUserAuth },
      {
        $push: {
          address: {
            fullName: req.body.fName,
            pincode: req.body.pincode,
            locality: req.body.locality,
            address: req.body.address,
            district: req.body.district,
            state: req.body.state,
            structuredAddress,
          },
        },
      },
      { upsert: true }
    );

    const addres = await userAddressdb.findOne({
      userId: req.session.isUserAuth,
    });

    if (!addres.defaultAddress || addres.address.length === 1) {
      await userAddressdb.updateOne(
        { userId: req.session.isUserAuth },
        { $set: { defaultAddress: addres.address[0]._id } }
      );
    }

    res.status(200).redirect("/userProfile");
  } catch (err) {
    console.log(err);
  }
}

exports.userEditAddress = async (req, res) => {
  const addressId = req.query.addressId;
  const userId = req.session.isUserAuth
  try {
    req.body.fName = req.body.fName.trim()
    req.body.locality = req.body.locality.trim()
    req.body.address = req.body.address.trim()
    req.body.state = req.body.state.trim()
    req.body.district = req.body.district.trim()

    if (!req.body.fName) {
      req.session.fName = `This Field is required`;
    }

    if (!req.body.pincode) {
      req.session.pincode = `This Field is required`;
    }

    if (!req.body.locality) {
      req.session.locality = `This Field is required`;
    }

    if (!req.body.address) {
      req.session.address = `This Field is required`;
    }

    if (!req.body.district) {
      req.session.district = `This Field is required`;
    }

    if (!req.body.state) {
      req.session.state = `This Field is required`;
    }

    if (
      req.session.fName ||
      req.session.pincode ||
      req.session.locality ||
      req.session.address ||
      req.session.district ||
      req.session.state
    ) {
      req.session.sAddress = req.body;
      return res.status(401).redirect("/userEditAddress");
    }

    req.body.fName = capitalizeFirstLetter(req.body.fName);
    req.body.locality = capitalizeFirstLetter(req.body.locality);
    req.body.district = capitalizeFirstLetter(req.body.district);
    req.body.state = capitalizeFirstLetter(req.body.state);

    // Validate if the addressId is provided
    if (!addressId) {
      return res.status(400).send("Address ID is required");
    }

    // Check if the address exists
    const existingAddress = await userAddressdb.findOne({
      userId: userId,
      "address._id": addressId,
    });

    if (!existingAddress) {
      return res.status(404).send("Address not found");
    }

    // Update the existing address
    await userAddressdb.updateOne(
      {
        userId: userId,
        "address._id": addressId,
      },
      {
        $set: {
          "address.$.fullName": fName,
          "address.$.pincode": req.body.pincode,
          "address.$.locality": locality,
          "address.$.address": req.body.address,
          "address.$.district": district,
          "address.$.state": state,
          "address.$.structuredAddress": `${req.body.fName}, ${req.body.address}, ${req.body.locality}, ${req.body.district}, ${req.body.state} - ${req.body.pincode}`
        },
      }
    );

    res.status(200).redirect("/userAddress");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

exports.deleteAddress = async (req, res) => {
  try {
    const address = await userAddressdb.findOneAndUpdate(
      { userId: req.session.isUserAuth },
      { $pull: { address: { _id: req.query.addressId } } }
    );

    if (
      String(address.defaultAddress) === req.query.addressId &&
      address.address.length > 1
    ) {
      const addres = await userAddressdb.findOne({
        userId: req.session.isUserAuth,
      });

      await userAddressdb.updateOne(
        { userId: req.session.isUserAuth },
        { $set: { defaultAddress: addres.address[0]._id } }
      );
    }
    res.status(200).redirect("/userAddress");
  } catch (err) {
    console.log("err");
    res.status(500).send(err);
  }
}

//----CART----//
exports.usersAddToCart = async (req, res) => {
  const userId = req.session.isUserAuth
  const productId = req.query.productId
  try {
    // const isCart = await Cartdb.findOne({ userId: userId })
    const isItem = await Cartdb.findOne({ userId: userId, 'products.productId': productId })
    console.log(isItem);
    if (isItem) {
      // req.session.inCart=true
      return res.status(200).redirect(`/userProductDetail/${productId}`)
    }

    // if (!isCart) {
    // const newUsercart = new Cartdb({
    //   userId: userId,
    //   products: [
    //     {
    //       productId: productId
    //     }
    //   ]
    // })
    // await newUsercart.save()
    // }
    await Cartdb.updateOne(
      { userId: userId },
      { $push: { products: { productId: productId } } },
      { upsert: true }
    )

    return res.status(200).redirect(`/userProductDetail/${productId}`)


  } catch (err) {
    res.status(500).send("Internal server error")
  }
}
exports.getCartItems = async (req, res) => {
  console.log('richin')
  const userId = req.query.userId;
  const productId = req.query.productId
  try {
    if (userId === "undefined") {
      return res.send(false);
    }
    // const cartItem = await Cartdb.findOne({ userId: userId });
    // console.log(cartItem);
    // if (!cartItem) {
    //   return res.send(false);
    // }
    // const isItem = cartItem.products.find((value) => {
    //   if (value.productId.toString() === req.query.productId) {
    //     return true;
    //   }
    // });
    const isItem = await Cartdb.findOne({ userId: userId, 'products.productId': productId });
    console.log(isItem);
    if (isItem) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (err) {
    console.log("err");
    res.status(500).send("Interal server error")
  }
}