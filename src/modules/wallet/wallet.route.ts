import express from 'express';
import { WalletController } from './wallet.controller';
import { authenticated } from '../../middlewares/jwt';

const router = express.Router();
const walletController = new WalletController();

// Get wallet
router.get('/', authenticated, walletController.getWallet);

// Confirm account
router.post('/confirm-account', authenticated, walletController.confirmUserWallet);

// Fund wallet
router.post('/fund', authenticated, walletController.fundWallet);

// Withdraw
router.post('/withdraw', authenticated, walletController.withdrawFunds);

// Transfer fund
router.post('/transfer', authenticated, walletController.transferFund);

export default router;