const { default: mongoose } = require('mongoose');
const Cartdb = require('../model/userModel/cartModel')
const Orderdb = require('../model/userModel/orderModel');
const Productdb = require('../model/adminModel/productModel');

exports.getCartItems = async (userId) => {
  try {
    if (!userId) {
      return null
    }
    const agg = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
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

exports.getOrders = async (userId) => {
  try {
    const agg = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $sort: {
          orderDate: -1
        }
      },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
    ];
    return await Orderdb.aggregate(agg);
  } catch (err) {
    console.log(err);
  }
}

exports.userCancelOrder = async (orderId, productId) => {
  try {
    const order = await Orderdb.findOneAndUpdate({
      $and: [{ _id: orderId }, { 'orderItems.productId': productId }]
    },
      {
        $set: {
          "orderItems.$.orderStatus": "Cancelled"
        }
      }
    )
    const units = order.orderItems.find(value => {
      if (String(value.productId) === productId) {
        return value.units;
      }
    })
    await Productdb.updateOne({ _id: productId },
      {
        $inc: {
          units: units.units
        }
      });

    return;
  } catch (err) {
    console.log(err);
  }
}