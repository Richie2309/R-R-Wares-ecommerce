const Userdb = require('../../model/userModel/userModel');
const Otpdb = require("../../model/userModel/otpModel");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { default: mongoose } = require("mongoose");
// const dotenv = config({ path: 'congif.env' })


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
  // const id = req.session.otpId
  // console.log(id);
  try {
    // const data = await Otpdb.findOne({ _id: id })
    // console.log(data);
    // /////////
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
  /////////////////
  //   if (data.otp == req.body.otp) {
  //     res.redirect('/userSignup')
  //   } else {
  //     req.session.err = "Invalid OTP"
  //     res.redirect('/userSignupOtpVerify')
  //   }

  // } catch (err) {
  //   console.log(err);
  // }
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
      req.session.fName = `This Field is required`;
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






//     if (!user) {
//       req.session.noUser = 'No user found'
//       return res.redirect('/userSigninEmail')
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password)

//     if (!isPasswordValid) {

//       req.session.wrongPass = 'Invalid password'
//       return res.redirect('/userSigninEmail')
//     }

//     res.redirect('/')
//   } catch (error) {
//     res.status(401).redirect("/userSigninEmail");
//   }
// }

exports.userLogout = async (req, res) => {
  await Userdb.updateOne(
    { _id: req.session.isUserAuth },
    { $set: { userLstatus: false } }
  );

  req.session.destroy();

  res.status(200).redirect("/");
}