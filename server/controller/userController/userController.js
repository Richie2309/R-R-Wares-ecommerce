const Userdb = require('../../model/userModel/userModel');
const Otpdb = require("../../model/userModel/otpModel");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { default: mongoose } = require("mongoose");
// const dotenv = config({ path: 'congif.env' })

const otpGenrator = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};


const sendOtpMail = async (req, res) => {

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
    res.status(200).redirect('/userSignupOtpVerify');
    await transporter.sendMail(message);
  } catch (err) {
    console.log(err);
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
  const id = req.session.otpId
  console.log(id);
  try {
    const data = await Otpdb.findOne({ _id: id })
    console.log(data);
    if (data.otp == req.body.otp) {
      res.redirect('/userSignup')
    } else {
      req.session.err = "Invalid OTP"
      res.redirect('/userSignupOtpVerify')
    }

  } catch (err) {
    console.log(err);
  }
}

exports.userSignup = async (req, res) => {
//   let nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
//  if (!nameRegex.test(fname)) {
//     req.session.fName = `Invalid name format`;
//   }
  let {fname, password, reenterpassword}=req.body
console.log('body',req.body);
  if (!fname || !/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(fname)) {
    req.session.fName = `This Field is required`;
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
    req.session.userSignup = req.body.fname;
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
      });
      console.log('ggggggg');
      await newUser.save();
      delete req.session.verifySignupPage;
      console.log('yguy');
      res.status(401).redirect("/userSigninEmail");
    } catch (err) {
      console.log(err);
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
    if (req.session.fName || req.session.pass) {
      return res.status(401).redirect('/userSigninEmail');
    }
    if (!user) {
      req.session.noUser = 'No user found'
      return res.redirect('/userSigninEmail')
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {

      req.session.wrongPass = 'Invalid password'
      return res.redirect('/userSigninEmail')
    }
  
    res.redirect('/')
  } catch (error) {
    res.status(401).redirect("/userSigninEmail");
  }
}

