import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';

import router from './router.js';

const server = express();

server.get('/', (req, res) => {
  res.status(200).json('Http Transfer App Live');
});

server.use(
  fileUpload({
    createParentPath: true,
  })
);

server.use(cors());
server.use(express.json());

server.use(router);

const startServer = (adress) => {
  return new Promise((resolve, reject) => {
    try {
      server.listen(3000, adress, () => {
        resolve(adress + ':3000');
      });
    } catch (error) {
      // console.log(error.code);
      // reject(adress);
    }
  });
};

export default startServer;
