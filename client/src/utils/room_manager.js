import { API_URL } from '../../config.js';
import got from 'got';

const create = async (host, code, password) => {
  try {
    await got.post(`${API_URL}/room`, {
      json: {},
    });
    return true;
    // console.log(response.statusCode);
    // console.log(response.body);
  } catch (error) {
    if (error.code === 'ERR_NON_2XX_3XX_RESPONSE') {
      console.log('\x1b[31m%s\x1b[0m', 'No room found with given code and password.');
    } else {
      console.log(error);
    }
  }
};
