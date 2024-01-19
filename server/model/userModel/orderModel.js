const mongodb = require('mongoose');

const orderSchema = new mongodb.Schema({
    userId: {
        type: mongodb.SchemaTypes.ObjectId,
        required: true,
    },
    orderItems: [
        {
            productId: {
                type: mongodb.SchemaTypes.ObjectId,
                required: true,
            },
            pName: {
                type: String,
                required: true
            },
            brand: {
                type: String,
                required: true
            },
            category: {
                type: String,
                required: true
            },
            pDescription: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            units: {
                type: Number,
                required: true
            },
            images: [
                {
                    type: String
                }
            ],
            orderStatus: {
                type: String,
                default: "Ordered",
                required: true
            },
        }
    ],
    paymentMethod: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now()
    }
});

const Orderdb = mongodb.model('Orderdb', orderSchema);

module.exports = Orderdb;