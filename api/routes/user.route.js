import express from 'express';
import { deleteUser, test, getUsers, updateUser, getUserListings, getUser } from '../controller/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.get('/test', test);
// router.get('/total-users',verifyToken, getTotalUsers);
router.get('/getusers', verifyToken, getUsers);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/:id', verifyToken, getUser);

export default router;