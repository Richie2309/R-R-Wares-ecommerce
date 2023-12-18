const axios = require('axios');

exports.homepage = (req, res) => {
    res.render('userViews/homepage')
}

exports.forHim = (req, res) => {
    res.render('userViews/forHim')
}

exports.forHer = (req, res) => {
    res.render('userViews/forHer')
}

// exports.userSignup = (req, res) => {
//     res.redirect('/userSignupOtpVerify');
//};
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
    res.render('userViews/userSignupOtpVerify', { email: req.session.verifyEmail, errorMesg: req.session.err }, (err, html) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Error');
        }
        delete req.session.err;
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
    const signinfo = { name: req.session.fName, pass: req.session.pass, noUser: req.session.noUser, wrongPass: req.session.wrongPass }
    res.render('userViews/userSigninEmail', { signinfo: signinfo }, (err, html) => {
        if (err) {
            console.log(err);
        }
        delete req.session.fName;
        delete req.session.pass;
        delete req.session.noUser;
        delete req.session.wrongPass;
        res.send(html)
    })
}


exports.userForgotPass = (req, res) => {
    res.render('userViews/userForgotPass')
}



exports.userEnterOtp = (req, res) => {
    res.render('userViews/userEnterOtp')
}

exports.userResetPassword = (req, res) => {
    res.render('userViews/userResetPassword')
}



// exports.userSignup = (req, res) => {
//     console.log('Checking verifyEmail session variable:', req.session.verifyEmail);

//     // Check if there is an ongoing signup process
//     if (req.session.verifyEmail) {
//         // Redirect to the OTP verification page if email is being verified
//         return res.redirect('/userSignupOtpVerify');
//     }

//     res.status(200).render('userViews/userSignup', {
//         userInfo: req.session.userSignup,
//         errMesg: {
//             fName: req.session.fName,
//             email: req.session.email,
//             pass: req.session.pass,
//             conPass: req.session.conPass,
//             bothPass: req.session.bothPass
//         }
//         userInfo: req.session.userSignup, errMesg: {
//             fName: req.session.fName,
//             email: req.session.email,
//             pass: req.session.pass,
//             conPass: req.session.conPass,
//             bothPass: req.session.bothPass
//         }
//     }, (err, html) => {
//         if (err) {
//             console.log('Signup Page render Err:', err);
//             return res.status(500).send('Internal Error');
//         }
//         delete req.session.userSignup;
//         delete req.session.fName;
//         delete req.session.pass;
//         delete req.session.conPass;
//         delete req.session.bothPass;

//         res.status(200).send(html);
//      } )
// }


