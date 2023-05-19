import express from 'express';
import cors from 'cors';
import router from './router.js';
import getPort, { portNumbers } from 'get-port';

import { APP_PATH, APP_DIR } from '../../config.js';

const server = express();

server.use(express.static(APP_DIR));

server.get('/', (req, res) => {
  res.status(200).sendFile(APP_PATH);
});

server.use(cors());
server.use(express.json());

server.use(cors(), router);

export const startApp = async (adress) => {
  try {
    const port = await getPort({ port: portNumbers(21800, 21900) });

    server.listen(port, adress, () => {
      console.log(`App live on http://${adress}:${port}`);
      //TODO QR CODE HERE
    });
  } catch (error) {
    //TODO behave whenever an error occures
  }
};
