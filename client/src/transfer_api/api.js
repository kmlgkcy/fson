import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import getPort, { portNumbers } from 'get-port';
import router from './router.js';

let server;
let serverLive = false;
let serverUri;

const app = express();

app.get('/', (req, res) => {
  res.status(200).json('Http Transfer App Live');
});

app.get('/kill', (req, res) => {
  res.status(200).json('Closing');
  server.close();
});

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(cors());
app.use(express.json());

app.use(cors(), router);

export const startServer = async (adress) => {
  try {
    if (!serverLive) {
      const port = await getPort({ port: portNumbers(21810, 21900) });
      server = app.listen(port, adress, () => {
        serverLive = true;
        serverUri = `http://${adress}:${port}`;
        console.log('Room Online'); //TODO QR CODE here
      });
    }
  } catch (error) {
    //TODO behave whenever an error occures
  }
};

export const closeServer = () => {
  if (serverLive) {
    server.close(() => {
      serverLive = false;
      serverUri = null;
      console.log('Room offline');
    });
  }
};

export const getServerUri = () => serverUri;
