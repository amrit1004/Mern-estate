import express from 'express';
import { deleteUser, updateUser ,getUser , getUserListing } from '../controllers/user.controllers.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();
router.post('/update/:id' ,verifyToken ,updateUser)
router.delete('/delete/:id' ,verifyToken ,deleteUser)
router.get('/listings/:id' ,verifyToken ,getUserListing)
router.get('/:id' , verifyToken ,getUser)
export default router;
