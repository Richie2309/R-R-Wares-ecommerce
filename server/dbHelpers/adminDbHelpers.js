const { default: mongoose } = require('mongoose');
const Cartdb = require('../model/userModel/cartModel')
const Orderdb = require('../model/userModel/orderModel')
const Productdb = require('../model/adminModel/productModel')
const Userdb = require('../model/userModel/userModel')

exports.getAllOrders = async (filter) => {
    try {
        const agg = [
            {
                $unwind: {
                    path: "$orderItems",
                },
            },
            {
                $lookup: {
                    from: "userdbs",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userInfo",
                },

            },

            // {
            //     $sort: {
            //         orderDate: -1,
            //     },
            // }
        ];
        // if (filter) {
        //     agg.splice(1, 0, {
        //         $match: {
        //             "orderItems.orderStatus": filter,
        //         },
        //     });
        // }
        return await Orderdb.aggregate(agg);
    } catch (err) {

    }
}

// exports.adminOrderManage = async (orderId, productId, orderStatus) => {
//     try {
//         if (orderStatus === 'Cancelled') {
//             const units = await Orderdb.findOne({ $and: [{ _id: new mongoose.Types.ObjectId(orderId) }, { 'orderItems.productId': productId }] }, { 'orderItems.$': 1, _id: 0 });
//             await Productdb.updateOne({ productId: productId }, { $inc: { units: units.orderItems[0].units } });
//         }
//         return await Orderdb.updateOne({ $and: [{ _id: new mongoose.Types.ObjectId(orderId) }, { "orderItems.productId": productId }] }, { $set: { "orderItems.$.orderStatus": orderStatus } });
//     } catch (err) {
//         console.log(err);
//     }
// }

exports.adminChangeOrderStatus = async (orderId, productId, orderStatus) => {
    try {
        if (orderStatus === 'Cancelled') {
            const units = await Orderdb.findOne({ $and: [{ _id: new mongoose.Types.ObjectId(orderId) }, { 'orderItems.productId': productId }] }, { 'orderItems.$': 1, _id: 0 });
            await Productdb.updateOne({ productId: productId }, { $inc: { units: units.orderItems[0].units } });
        }
        return await Orderdb.updateOne({ $and: [{ _id: new mongoose.Types.ObjectId(orderId) }, { "orderItems.productId": productId }] }, { $set: { "orderItems.$.orderStatus": orderStatus } });
    } catch (err) {
        console.log(er);
    }
}