import express from 'express';
import { AppLogController } from './app-log.controller';

const router = express.Router();
const appLogController = new AppLogController();

// Get app logs
router.get('/', appLogController.getAppLogs);

export default router;