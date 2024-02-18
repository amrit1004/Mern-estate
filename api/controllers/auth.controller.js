import User from '../models/user.models.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
export const signup = async (req , res) =>{
    const {username , email , password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password ,10)
    const newUser  = new User({username ,email ,  password :hashedPassword});
    try {
        await newUser.save();
        res.status(201).json("User created Succesfuly")
    } catch (error) {
       console.log(error)
    }
}