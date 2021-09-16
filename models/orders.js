const mongoose = require('mongoose');

const Orders = mongoose.model('Orders', new mongoose.Schema({
    productId: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}))

module.exports = Orders;