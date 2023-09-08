import { Router } from '../types/app';
import user from './user/user.route';
// import logs from './app-log/app-log.route';

const router = Router();

router.use('/auth', user);
// router.use('/xp', logs);

export default router;