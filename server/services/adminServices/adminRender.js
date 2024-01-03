const axios = require('axios');
const { response } = require('express');
const Productdb = require('../../model/adminModel/productModel');

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

exports.adminHome = async (req, res) => {
  const users = await axios.post(`http://localhost:${process.env.PORT}/api/getAllUser`);
  res.render('adminViews/adminHome', { users: users.data });
}

//product manage
exports.adminProductManage = async (req, res) => {
  try {
    const products = await axios.get(`http://localhost:${process.env.PORT}/api/getProduct/1`);
    res.status(200).render("adminViews/adminProductManage", { products: products.data }, (err, html) => {
      if (err) {
        console.error("Error rendering HTML:", err);
        return res.status(500).send("Internal server error");
      }
      delete req.session.productInfo;
      res.send(html);
    });
  } catch (err) {
    // Handle the error within the catch block
    console.log("render page adminproductmanage catch block");
    res.status(500).send('Internal server error');
  }
};

exports.adminAddProduct = async (req, res) => {
  try {
    const category = await axios.post(`http://localhost:${process.env.PORT}/api/getCategory/1`)
    res.status(200).render("adminViews/adminAddProduct", {
      category: category.data,
      product: {
        pName: req.session.pName,
        brand: req.session.brand,
        pDescription: req.session.pDescription,
        price: req.session.price,
        units: req.session.units,
        files: req.session.files,
      },
      savedDetails: req.session.productInfo,
    }, (err, html) => {
      if (err) {
        console.error("Error rendering view:", err);
        return res.status(500).send("Internal Server Error");
      }
      delete req.session.pName;
      delete req.session.brand;
      delete req.session.price;
      delete req.session.units;
      delete req.session.pDescription;
      delete req.session.productInfo;
      delete req.session.files

      res.send(html);
    }
    )

  } catch (err) {
    console.log("err", err);
    res.send("Internal server err hh");
  }
}

// const product = { pName: req.session.pName, brand: req.session.brand, category: req.session.category, pDescription: req.session.pDescription, price: req.session.price, units: req.session.units };
// res.status(200).render('adminViews/adminAddProduct', { product: product }, (err, html) => {
//   if (err) {
//     console.log(err);
//   }
//   delete req.session.pName;
//   delete req.session.brand;
//   delete req.session.category;
//   delete req.session.pDescription;
//   delete req.session.price;
//   delete req.session.units;
//   res.send(html)
// })
// }

exports.adminUpdateProduct = async (req, res) => {
  try {
    console.log(req.params.id);
    const [category, product] = await Promise.all([
      axios.post(`http://localhost:${process.env.PORT}/api/getCategory/1`),
      axios.get(`http://localhost:${process.env.PORT}/api/singleProduct/${req.params.id}`)]);

    res.status(200).render("adminViews/adminUpdateProduct", {
      category: category.data,
      product: product.data,
      savedDetails: req.session.updateProductInfo,
      errMesg: {
        pName: req.session.pName,
        brand: req.session.brand,
        pDescription: req.session.pDescription,
        price: req.session.price,
        units: req.session.units,
        files: req.session.files,
        category: req.session.category,
      }
    },

      (err, html) => {
        if (err) {
          console.error("Error rendering view:", err);
          return res.status(500).send("Internal Server Error");
        }
        delete req.session.pName;
        delete req.session.brand;
        delete req.session.price;
        delete req.session.units;
        delete req.session.pDescription;
        delete req.session.productInfo;
        delete req.session.files
        delete req.session.updateProductInfo;

        res.send(html);
      }
    );
  } catch (err) {
    console.log("err", err);
    res.send("Internal server err");
  }

}

exports.adminUnlistedProduct = async (req, res) => {
  try {
    console.log("before");
    const product = await axios.get(`http://localhost:${process.env.PORT}/api/getProduct/0`);
    console.log(product);

    res.status(200).render('adminViews/adminUnlistedProduct', { products: product.data })
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).send('Internal server error');
  }
}

//Category Management
exports.adminCategoryManage = async (req, res) => {
  try {
    const category = await axios.post(
      `http://localhost:${process.env.PORT}/api/getCategory/1`);
    res.render("adminViews/adminCategoryManage", { category: category.data });
  } catch (err) {
    res.send("Internal server err");

  }
}

exports.adminAddCategory = (req, res) => {
  res.status(200).render('adminViews/adminAddCategory', { err: req.session.errMesg }, (err, html) => {
    if (err) {
      res.status(500).send("Internal server error")
    }
    delete req.session.errMesg;
    res.send(html);
  })
}

exports.adminUnlistedCategory = async (req, res) => {
  try {

    console.log(req.params.value);
    const category = await axios.post(`http://localhost:${process.env.PORT}/api/getCategory/0`)
    res.status(200).render('adminViews/adminUnlistedCategory', { category: category.data })
  } catch (err) {
    res.send("Internal server error");
  }
}

//User maanage
exports.adminUserManage = async (req, res) => {
  const users = await axios.post(`http://localhost:${process.env.PORT}/api/getAllUser`);
  res.status(200).render('adminViews/adminUserManage', { users: users.data });
}



