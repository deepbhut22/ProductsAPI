const express = require('express');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

// connecting our express app to the MongoDB database named newnew
mongoose.connect("mongodb://127.0.0.1:27017/newnew")
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// defining the schema for the products collection.
const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
});

// defining the model of collection(products)
const Product = mongoose.model('Product', Schema);


// saving two objects into Product/products schema in database
const obj1 = new Product({
    name: "car",
    description: "nice",
    price: 1000
})
obj1.save();
const obj2 = new Product({
    name: "bike",
    description: "noice",
    price: 9999
})
obj2.save();

// below function retrives all the objects from the database
app.get('/products', (req, res) => {
    Product.find()
      .then((products) => res.json(products))
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
      });
  });

// below app.get() function is used to retrive a perticular object with id
app.get('/products/:id', (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.json(product);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Server error' });
    });
});

// I used postman to send PUT request and below function is to update the price,
// of object whose id is sent through PUT request
app.put('/products/:id', (req, res) => {
    Product.findByIdAndUpdate(req.params.id, { $set: { price: req.body.price } }, { new: true })
      .then((product) => {
        if (!product) {
          res.status(404).json({ error: 'Product not found' });
        } else {
          res.json(product);
        }
      })
      .catch((err) => {                                     /*this can catch error like , when you mistakely 
                                                              send other data than number through request*/          
        console.log(err);
        res.status(500).json({ error: 'Server error' });
      });
  }); 

// Simple error control code
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ error: 'Server error' });
});

app.listen(3000, () => {
  console.log(`Server started on port 3000`);
});
