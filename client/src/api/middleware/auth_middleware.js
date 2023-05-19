import { authenticate } from '../../utils/authenticator.js';

export default (req, res, next) => {
  const password = req.headers['x-auth-password'];

  if (authenticate(password)) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};
