import { Router } from '../types/app';
import user from './user/user.route';
import wallet from './wallet/wallet.route';
import transaction from './transaction/transaction.route';

const router = Router();

router.use('/auth', user);
router.use('/wallet', wallet);
router.use('/transaction', transaction);

export default router;