const axios = require('axios');

// exports.adminSignin=(req,res)=>{
//     res.render('adminViews/adminSignin')
// }

exports.adminSignin = (req, res) => {
  res.render(
    "adminViews/adminSignin",
    {
      invalid: req.session.invalidAdmin, adminErr: {
        adminEmail: req.session.adminEmail,
        adminPassword: req.session.adminPassword
      }
    },
    (err, html) => {
      if (err) {
        console.error("Error rendering view:", err);
        return res.status(500).send("Internal Server Error");
      }

      delete req.session.invalidAdmin;
      delete req.session.adminPassword;
      delete req.session.adminEmail;

      res.send(html);
    }
  );

}

exports.adminHome = (req, res) => {
  res.render('adminViews/adminHome');
}

exports.adminProductManage = (req, res) => {
  res.render('adminViews/adminProductManage');
}

exports.adminAddProduct = (req, res) => {
  const product = { pName: req.session.pName, brand: req.session.brand, category: req.session.category, pDescription: req.session.pDescription, price: req.session.price, units: req.session.units };
  res.status(200).render('adminViews/adminAddProduct',{product:product} ,(err,html)=>{
    if(err){
      console.log(err);
    }
    delete req.session.pName;
    delete req.session.brand;
    delete req.session.category;
    delete req.session.pDescription;
    delete req.session.price;
    delete req.session.units;
    res.send(html)
  })
}

exports.adminUnlistedProduct = (req, res) => {
  res.render('adminViews/adminUnlistedProduct')
}

exports.adminCategoryManage = (req, res) => {
  res.render('adminViews/adminCategoryManage')
}

exports.adminAddCategory = (req, res) => {
  res.render('adminViews/adminAddCategory')
}

exports.adminUnlistedCategory = (req, res) => {
  res.render('adminViews/adminUnlistedCategory')
}

exports.adminUserManage = async(req, res) => {
  const users = await axios.post(`http://localhost:${process.env.PORT}/api/getAllUser`);
  res.status(200).render('adminViews/adminUserManage', {users: users.data});
}



