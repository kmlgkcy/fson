import { debug } from './controller/debug_controller.js';
import { download, upload, getFileNames } from './controller/transfer_controller.js';

import { Router } from 'express';

const router = Router();

router.route('/transfer').get(download).post(upload);
router.route('/files').get(getFileNames);

router.route('/status').get(debug);

export default router;
