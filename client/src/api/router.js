import { Router } from 'express';
import {
  openRoom,
  closeRoom,
  getAllDirectories,
  addNewDirectory,
  deleteDirectory,
  clearTemps,
} from './controller/management_controller.js';
import { getRoomUri } from './controller/room_controller.js';
import { login } from './controller/authentication_controller.js';
import authenticator from './middleware/auth_middleware.js';

const router = Router();

router.route('/room').get(getRoomUri);
router.route('/room/open').post(authenticator, openRoom);
router.route('/room/close').post(authenticator, closeRoom);
router.route('/auth').get(login);
router.route('/clear/temp').delete(authenticator, clearTemps);
router
  .route('/config/directory')
  .get(authenticator, getAllDirectories)
  .post(authenticator, addNewDirectory)
  .delete(authenticator, deleteDirectory);

export default router;
