import { join } from 'path';
import selectInterface from './src/utils/start_server.js';
import { setPassword } from './src/utils/authenticator.js';
import { startServer as startApi } from './src/transfer_api/api.js';
import { startAdminServer } from './src/api/api.js';
import { startApp } from './src/transfer_app/app.js';

process.env.DIR = process.cwd();
process.env.TRANSFER_DIR = join(process.env.DIR, 'transfer');
process.env.TRANSFER_DIR_UPLOAD = join(process.env.TRANSFER_DIR, 'uploaded');

const main = async () => {
  const host = await selectInterface();
  process.env.HOST = host;
  await setPassword();
  await startApp(host);
  await startAdminServer(host);
  await startApi(host);
};

main();
