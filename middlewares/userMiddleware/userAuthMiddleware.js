const Userdb = require('../../server/model/userModel/userModel');

module.exports = {
    otpVerify: (req, res, next) => {
        if (req.session.verifyOtpPage) {
            next();
        } else {
            res.redirect('/userSignupEmail');
        }
    },
    userSignupVerify: (req, res, next) => {
        if (req.session.verifySignupPage) {
            next();
        } else {
            res.redirect('/userSignupOtpVerify');
        }
    },
    noUserSignupVerify: (req, res, next) => {
        if (req.session.verifySignupPage) {
            res.redirect('/userSignup');
        } else {
            next();
        }
    },
    isUserAuth: (req, res, next) => {
        if (req.session.isUserAuth) {
            res.redirect('/');
        } else {
            next();
        }
    },
    isUserBlocked: async (req, res, next) => {
        try {
            if (!req.session.isUserAuth) {
                return next();
            }
            const data = await Userdb.findOne({ _id: req.session.isUserAuth });

            if (!data || !data.userStatus) {
                req.session.userBlockedMesg = true;
                delete req.session.isUserAuth;
                return res.status(200).redirect('/userSigninEmail');
            }
            next();
        } catch (err) {
            console.log('Middle ware err', err);
            res.status(401).send('You are blocked');
        }
    },
    isUserLoggedIn: (req, res, next) => {
        if (req.session.isUserAuth) {
            console.log(req.session.isUserAuth);
            next();
        } else {
            res.status(200).redirect('/userSigninEmail');
        }
    }
} 