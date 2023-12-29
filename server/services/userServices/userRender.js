const axios = require('axios');
const Productdb = require('../../model/adminModel/productModel');

exports.homepage = async (req, res) => {
    const category = await axios.post(`http://localhost:${process.env.PORT}/api/getCategory/1`);
    console.log(category);

    res.render('userViews/homepage', { isLoggedIn: req.session.isUserAuth, category: category.data });
}

exports.singleProductCategory = async (req, res) => {
    try {
        const name = req.query.name
        const product = await axios.get(`http://localhost:${process.env.PORT}/api/productByCategory?name=${name}`)
        const category = await axios.post(`http://localhost:${process.env.PORT}/api/getCategory/1`);
        console.log(product);
        res.render('userViews/singleProductCategory', { isLoggedIn: req.session.isUserAuth, product: product.data, category: category.data, selectedCategory: name });
        console.log(product.data);
    }
    catch (err) {
        console.log(err);
    }
}

exports.userProductDetail = async (req, res) => {
    try {
        const productId = req.query.productId
        const product = await axios.get(`http://localhost:${process.env.PORT}/api/getProductDetail?productId=${productId}`)
        res.render('userViews/userProductDetail', { isLoggedIn: req.session.isUserAuth, product: product.data[0] })
    } catch (err) {
        console.log(err);
    }
}


//Women's Page
exports.forHer = (req, res) => {
    res.render('userViews/forHer', { isLoggedIn: req.session.isUserAuth });
}


exports.userSignupEmailVerify = async (req, res) => {
    res.render('userViews/userSignupEmail', { isUser: req.session.isUser }, (err, html) => {
        if (err) {
            console.log(err);
        }
        delete req.session.isUser
        res.send(html)
    })
}

exports.userSignupOtpVerify = async (req, res) => {

    res.render('userViews/userSignupOtpVerify', { email: req.session.verifyEmail, errorMesg: req.session.err, rTime: req.session.rTime }, (err, html) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Error');
        }
        delete req.session.err;
        delete req.session.rTime;
        res.send(html)
    })
}


exports.userSignup = (req, res) => {
    const signinfo = { name: req.session.fName, pass: req.session.pass, conPass: req.session.conPass, bothPass: req.session.bothPass }
    res.status(200).render('userViews/userSignup', { signinfo: signinfo }, (err, html) => {
        if (err) {
            console.log(err);
        }
        delete req.session.fName;
        delete req.session.pass;
        delete req.session.conPass;
        delete req.session.bothPass;
        res.send(html)
    });
}

exports.userSigninEmail = (req, res) => {
    const signinfo = { name: req.session.fName, pass: req.session.pass, noUser: req.session.noUser, wrongPass: req.session.wrongPass, isBlock: req.session.userBlockedMesg }
    res.render('userViews/userSigninEmail', { signinfo: signinfo }, (err, html) => {
        if (err) {
            console.log(err);
        }
        delete req.session.fName;
        delete req.session.pass;
        delete req.session.noUser;
        delete req.session.wrongPass;
        delete req.session.userBlockedMesg;
        res.send(html)
    })
}

exports.userForgotPass = async (req, res) => {
    res.render('userViews/userForgotPass', { isUser: req.session.isUser }, (err, html) => {
        if (err) {
            console.log(err);
        }
        delete req.session.isUser;
        res.send(html)
    })
}



exports.userEnterOtp = (req, res) => {
    res.render('userViews/userEnterOtp', { email: req.session.verifyEmail, errorMesg: req.session.err, rTime: req.session.rTime }, (err, html) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Error');
        }
        delete req.session.err;
        delete req.session.rTime;
        res.send(html)
    })
}

exports.userResetPassword = (req, res) => {
    res.render('userViews/userResetPassword', { pass: req.session.pass, conPass: req.session.conPass, bothPass: req.session.bothPass }, (err, html) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Error');
        }
        delete req.session.pass;
        delete req.session.conPass;
        delete req.session.bothPass;
        res.send(html)
    })
}



