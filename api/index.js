import mongoose from "mongoose"
import express from "express"
import dotenv from "dotenv"
import authRouter  from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import listingRouter from "./routes/listing.route.js"
import cors from 'cors'
import cookieParser from "cookie-parser"
import path from 'path'
dotenv.config();
const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,  // Enable credentials (cookies, authorization headers, etc.)
}));

app.use(cookieParser());
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
   const __dirname = path.resolve();
  app.use('/api/auth' ,authRouter);
  app.use('/api/user', userRouter);
  app.use('/api/listing', listingRouter);
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  })

  
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