import express from 'express';
import { TransactionController } from './transaction.controller';

const router = express.Router();
const transactionController = new TransactionController();

// Get transaction
router.get('/', transactionController.getTransactions);

export default router;