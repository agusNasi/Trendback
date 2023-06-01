import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routers/seedRoutes.js';
import productRouter from './routers/productRoutes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to DB');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server ready on port => ${PORT}`);
});
