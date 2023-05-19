import { join } from 'path';
import { HOST } from './config.js';
import { startServer as startApi } from './src/transfer_api/api.js';
import { startAdminServer } from './src/api/api.js';
import { startApp } from './src/transfer_app/app.js';

import { setPassword } from './src/utils/authenticator.js';

process.env.DIR = process.cwd();
process.env.TRANSFER_DIR = join(process.env.DIR, 'transfer');
process.env.TRANSFER_DIR_UPLOAD = join(process.env.TRANSFER_DIR, 'uploaded');
process.env.HOST = '192.168.0.21';

const main = async () => {
  console.clear();
  await setPassword('admin');
  const host = HOST();
  await startApp(host);
  await startAdminServer(host);
  await startApi(host);
};

main();
