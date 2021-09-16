const Products = require('../models/products');
const Orders = require('../models/orders');

const getProductId = async (orderId) => {
    try {
    let order = await Orders.findOne({_id: orderId})
    let product = await Products.findOne({productId: order.productId})
    return product.productId;
    } catch(er) {
        console.log(er);
    }
}

const handleWebSocketMessage = async (message) => {
    try {
        const parsedMessage = JSON.parse(message)
        if (!parsedMessage.operation) {
            parsedMessage.forEach(product => {
                let newProduct = new Products({
                    productId: product.productId,
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                })
                newProduct.save();
            })
        }
        if (parsedMessage.operation == 'product.stock.decreased') {
            let productId = parsedMessage.payload.productId;
            if (!productId) productId = await getProductId(parsedMessage.correlationId);
            let newStock = parsedMessage.payload.stock;
            await Products.findOneAndUpdate({productId: productId}, {stock: newStock});
        }
        if (parsedMessage.operation == 'product.stock.updated') {
            let productId = parsedMessage.payload.productId;
            let newStock = parsedMessage.payload.stock;
            await Products.findOneAndUpdate({productId: productId}, {$inc: {stock: newStock}});
        }
    } catch(er) {
        console.log(er);
    }
}

module.exports = {
    handleWebSocketMessage: handleWebSocketMessage
} 