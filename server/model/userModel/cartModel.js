const mongodb = require("mongoose");

const cartSchema = new mongodb.Schema({
  userId: {
    type: mongodb.SchemaTypes.ObjectId,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongodb.SchemaTypes.ObjectId,
        required: true,
      },
      quandity: {
        type: Number,
        default: 1
      }
    },
  ],
});

const Cartdb = mongodb.model('Cartdb', cartSchema);

module.exports = Cartdb