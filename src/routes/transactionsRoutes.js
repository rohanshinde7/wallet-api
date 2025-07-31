import express, { Router } from 'express';
import { sql } from '../config/db.js'; 
import {createTransaction, deleteTransaction, getSummaryById, getTransactionsByUserId} from "../controller/transactionsController.js";



const router = express.Router();

router.get("/:user_id", getTransactionsByUserId);

router.delete("/:id", deleteTransaction);

router.get("/summary/:user_id", getSummaryById);

router.post("/", createTransaction);



export default router;