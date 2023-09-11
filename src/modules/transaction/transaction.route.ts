import express from 'express';
import { TransactionController } from './transaction.controller';
import { authenticated } from '../../middlewares/jwt';

const router = express.Router();
const transactionController = new TransactionController();

// Get transaction
router.get('/', authenticated, transactionController.getTransactions);

export default router;