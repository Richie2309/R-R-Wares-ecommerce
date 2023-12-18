const mongodb = require('mongoose');

exports.productSchema = new mongodb.Schema({
    pName: {
        type: String,
        required: true
    },
    brand:{
        type: String,
        required:true
    },
    category: {
        type: String,
        required: true
    },
    pDescription:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required:true
    },
    units:{
        type:Number,
        required:true
    },
    images: [
        {
            type: String
        }
    ]  
})

exports.unlistedProductSchema = new mongodb.Schema({
    pName: {
        type: String,
        required: true
    },
    brand:{
        type: String,
        required:true
    },
    category: {
        type: String,
        required: true
    },
    pDescription:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required:true
    },
    units:{
        type:Number,
        required:true
    },
    images: [
        {
            type: String
        }
    ]  
})