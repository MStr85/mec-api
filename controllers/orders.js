const Orders = require('../models/orders');
const Products = require('../models/products');

const handleGetOrderDetails = async (req, res) => {
    try {
        let { orderId } = req.params;
        let order = await Orders.findOne({_id: orderId});
        if (!order) return res.status(404).json('Zamównienie nie zostało znalezione');
        let product = await Products.findOne({ productId: order.productId });
        const data = {
            name: product.name,
            quantity: order.quantity
        }
        res.json(data);
    } catch(er) {
        console.log(er);
    }
}

const handlePostOrder = async (req, res) => {
    try {
    const { productId, quantity } = req.body;
    const product = await Products.findOne({ productId: productId });
    if (!product) {
        return res.status(404).json('Produkt nie został znaleziony');
    }
    if (product.stock < quantity) {
        return res.status(400).json('Nie ma tylu sztuk w magazynie');  
    }
    let newOrder = new Orders({
        productId: productId,
        quantity: quantity
    })
    newOrder.save();
    let orderToWS = {
        "operation": "product.stock.decrease",
        "correlationId": newOrder._id.toString(),
        "payload": {
          "productId": productId,
          "stock": quantity
        }
    }
    return orderToWS;
    } catch(er) {
        console.log(er);
    }
}

module.exports = {
    handleGetOrderDetails: handleGetOrderDetails,
    handlePostOrder: handlePostOrder
}