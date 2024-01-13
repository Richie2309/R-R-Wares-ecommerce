const { default: mongoose } = require('mongoose');
const Cartdb = require('../model/userModel/cartModel')

exports.getCartItems = async (userId) => {
  try {
    if (!userId) {
      return null
    }
    const agg = [
      {
        '$unwind': {
          'path': '$products'
        }
      }, {
        '$lookup': {
          'from': 'productdbs',
          'localField': 'products.productId',
          'foreignField': '_id',
          'as': 'pDetail'
        }
      }
    ];
    return await Cartdb.aggregate(agg)
  } catch (err) {
    return err;
  }
}

// exports.userCheckout = async (userId) => {

// }