import express from 'express';
import { WalletController } from './wallet.controller';

const router = express.Router();
const walletController = new WalletController();

// Get wallet
router.get('/', walletController.getWallet);

// Transfer fund
router.post('/confirm-account', walletController.confirmUserWallet);

// Transfer fund
router.post('/transfer', walletController.transferFund);

export default router;