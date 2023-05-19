import { Router } from 'express';

import { getRoomUri } from './controller/room_controller.js';

const router = Router();

router.route('/room').get(getRoomUri);

export default router;
