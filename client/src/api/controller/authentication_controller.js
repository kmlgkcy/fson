import { authenticate } from '../../utils/authenticator.js';

export const login = (req, res) => {
  const password = req.headers['x-auth-password'];
  if (authenticate(password)) {
    res.sendStatus(200);
  } else {
    res.status(401).send('Unauthorized');
  }
};
