import express from 'express';
import cors from 'cors';
import router from './router.js';
import getPort, { portNumbers } from 'get-port';
import { ADMIN_APP_DIR, ADMIN_APP_PATH } from '../../config.js';

const server = express();

server.use('/', express.static(ADMIN_APP_DIR));

server.get('/', (req, res) => {
  res.status(200).sendFile(ADMIN_APP_DIR);
});

server.use(cors());
server.use(express.json());

server.use(cors(), router);

export const startAdminServer = async (adress) => {
  try {
    const port = await getPort({ port: portNumbers(21801, 21900) });

    server.listen(port, adress, () => {
      console.log(`Admin Panel live on http://${adress}:${port}`);
    });
  } catch (error) {
    //TODO behave whenever an error occures
  }
};
