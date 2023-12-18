

// route.post('/usersignup', userController.createUser);

// const credential = {
//     email: "admin@gmail.com",
//     password: "123"
// }

// const authenticateAdmin = (req, res, next) => {
//     console.log(req.session.admin);
//     if (req.session.admin) {
//         next();
//     } else {
//         res.redirect('/adminSignin');
//     }
// };

// route.get('/adminHome', authenticateAdmin, services.adminHome);

// route.get('/adminSignin', services.adminSignin); 

// route.post('/login', (req, res) => {
//     if (req.body.email === credential.email && req.body.password === credential.password) {
//         req.session.admin = req.body.email;
//         res.redirect('/adminHome');
//     } else {
//         res.status(401).json({ error: 'Invalid credentials' });
//     }
// });


// route.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('/adminSignin')
// })

// // router.get('/getOtp', async (req, res) => {
// //     const email = req.query.email;
// //     if (email) {
// //       const otpId = await otpService.sendOtpMail(email);
// //       if (otpId) {
// //         res.json({ success: true });
// //       } else {
// //         res.json({ success: false });
// //       }
// //     } else {
// //       res.json({ success: false });
// //     }
// //   });

// module.exports = route