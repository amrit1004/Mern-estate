import mongoose from "mongoose"
import express from "express"
import dotenv from "dotenv"
import authRouter  from "./routes/auth.route.js"
import cors from 'cors'
dotenv.config();
const app = express()
app.use(cors({
  origin: '*',
  credentials: true
}))
app.use(express.json());
const port = 3000
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });
  app.use('/api/auth' ,authRouter);
  app.use((err , req , res , next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
      success : false ,
      statusCode,
      message
    })
    next()
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })