const Products = require('../models/products');

const handleGetProductDetails = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Products.findOne({productId: productId});
        if (!product) return res.status(404).json('Produkt nie został znaleziony')
        res.json(product);
    } catch(er) {
        console.log(er);
    }
}

const handleGetProducts = async (req, res) => {
    try {const productList = await Products.find({});
    res.json(productList);
    } catch(er) {
        console.log(er);
    }
}

module.exports = {
    handleGetProductDetails: handleGetProductDetails,
    handleGetProducts: handleGetProducts
}