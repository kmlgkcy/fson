import { debug } from './controller/debug_controller.js';
import { downloadFile, uploadFile, getDirectory } from './controller/transfer_controller.js';
import { createTask, readTask, removeTask, updateTask } from './controller/task_controller.js';

import { Router } from 'express';

const router = Router();

router.route('/transfer').get(downloadFile);
router.route('/transfer/:id').post(uploadFile);
router.route('/transfer/dir').get(getDirectory);

router.route('/task').post(createTask);
router.route('/task/:id').get(readTask).put(updateTask).delete(removeTask);

router.route('/status').get(debug);

export default router;
