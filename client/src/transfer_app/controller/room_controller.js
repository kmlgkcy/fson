import { getServerUri } from '../../transfer_api/api.js';

export const getRoomUri = (req, res) => {
  const uri = getServerUri();
  if (uri) {
    res.status(200).send(uri);
  } else {
    res.status(503).send('Server Not Live yet');
  }
};
