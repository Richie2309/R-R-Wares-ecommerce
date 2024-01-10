const Userdb = require('../../server/model/userModel/userModel');

module.exports = {
    otpVerify: (req, res, next) => {
        if (req.session.verifyOtpPage) {
            next();
        } else {
            res.redirect('/userSignupEmail');
        }
    },


    isUserAuth: (req, res, next) => {
        if (req.session.isUserAuth) {
            res.redirect('/');
        } else {
            next();
        }
    },

    isUserAuth2: (req, res, next) => {
        if (req.session.isUserAuth) {
            next();
        } else {
            res.redirect('/');
        }
    },
    // userLoginResetPassword: (req, res, next) => {
    //     if (req.session.resetPasswordPage) {
    //         next();
    //     } else {
    //         res.redirect('/userSigninEmail');
    //     }
    // },
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

} 