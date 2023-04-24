import { join } from 'path';
import selectInterface from './src/utils/start_server.js';
import startServer from './src/server.js';
import connect from './src/utils/connect.js';

process.env.DIR = process.cwd();
process.env.TRANSFER_DIR = join(process.env.DIR, 'transfer');
process.env.TRANSFER_DIR_UPLOAD = join(process.env.TRANSFER_DIR, 'uploaded');

const main = async () => {
  const host = await selectInterface();
  const adress = await startServer(host);
  //   console.log('Selected interface already in use from another program. Try other');
  console.log('Selected adress:' + host);
  await connect(adress);
  console.clear();
  console.log('\x1b[35m%s\x1b[0m', `Succesfully connected to "${process.env.ROOM_CODE}" room`);
};

main();
