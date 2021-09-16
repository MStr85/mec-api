const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const MONGOURL = require('./env');

const products = require('./controllers/products');
const orders = require('./controllers/orders');
const wscontroller = require('./controllers/wscontroller');

const decoder = new TextDecoder('utf-8');
const app = express();
const webSocketClient = new WebSocket('wss://mec-storage.herokuapp.com');

mongoose.connect(MONGOURL, {
    useNewUrlParser: true
})

webSocketClient.on('open', () => {
  console.log('WebSocket connected');
});

webSocketClient.on('error', (error) => {
  console.log(error);
});

webSocketClient.on('close', () => {
  console.log('WebSocket disconnected');
});

webSocketClient.on('message', (data) => {
  wscontroller.handleWebSocketMessage(decoder.decode(data));
});

app.use(express.json());
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/products',(req, res) => products.handleGetProducts(req, res));
app.get('/order/:orderId',(req, res) => orders.handleGetOrderDetails(req, res));
app.get('/product/:productId', (req, res) => products.handleGetProductDetails(req, res));
app.post('/order', async (req, res) => {
  let data = await orders.handlePostOrder(req, res);
  if (data.correlationId) {
    webSocketClient.send(JSON.stringify(data));
    res.json(data.correlationId);
  }
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port 3000`);
});