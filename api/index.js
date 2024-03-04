import mongoose from "mongoose"
import express from "express"
import dotenv from "dotenv"
import authRouter  from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import cors from 'cors'
import cookieParser from "cookie-parser"
dotenv.config();
const app = express()
app.use(cors({
  origin: '*',
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());
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
  app.use('/api/user', userRouter);
  app.use((err , req , res , next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success : false ,
      statusCode,
      message
    })
    
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })