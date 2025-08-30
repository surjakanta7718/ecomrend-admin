const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Product = require('./models/Product');

const products = [
  { 
    title: 'Plain T-Shirt', 
    description: 'Simple text-only tshirt listing', 
    price: 299, 
    stock: 50, 
    category: 'Clothing', 
    brand: 'Nike' 
  },
  { 
    title: 'Notebook', 
    description: 'Simple ruled notebook', 
    price: 49, 
    stock: 200, 
    category: 'Stationery', 
    brand: 'Classmate' 
  },
  { 
    title: 'Pen', 
    description: 'Blue ink pen', 
    price: 12, 
    stock: 500, 
    category: 'Stationery', 
    brand: 'Reynolds' 
  },
  { 
    title: 'Water Bottle', 
    description: '1L bottle', 
    price: 199, 
    stock: 80, 
    category: 'Home & Kitchen', 
    brand: 'Milton' 
  },
  { 
    title: 'iPhone 14', 
    description: 'Latest Apple iPhone', 
    price: 69999, 
    stock: 20, 
    category: 'Electronics', 
    brand: 'Apple' 
  },
  { 
    title: 'Running Shoes', 
    description: 'Comfortable running shoes', 
    price: 2999, 
    stock: 60, 
    category: 'Shoes', 
    brand: 'Adidas' 
  }
];

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('✅ Database seeded successfully!');
    process.exit();
  })
  .catch(err => { 
    console.error('❌ Error seeding database:', err); 
    process.exit(1); 
  });

