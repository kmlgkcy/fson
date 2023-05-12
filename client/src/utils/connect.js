import got from 'got';

const stdin = process.openStdin();
const stdout = process.stdout;

export default async (host) => {
  console.log('\x1b[33m%s\x1b[0m', '\nJoin a room with room code and password');

  return new Promise(async (resolve, reject) => {
    let attemp = 5;
    while (true) {
      if (attemp <= 0) {
        console.log('Too many failed attemps exiting.');
        process.exit(0);
      }
      const codeInput = await code();
      const pwdInput = await pwd();
      const res = await connect(host, codeInput, pwdInput);
      if (res) {
        process.env.ROOM_CODE = codeInput;
        resolve();
        break;
      }
      attemp--;
    }
  });
};

const code = () => {
  return new Promise((resolve, reject) => {
    stdout.write(`\n${'Code'.padEnd(8, ' ')}: `);
    stdin.addListener('data', (val) => {
      //give an error when input val not valid
      if (String(val).trim().length < 4 || String(val).trim().length > 16) {
        stdout.write('Code: ');
      } else {
        stdout.write('\x1b[8m');

        stdin.removeAllListeners('data');

        resolve(String(val).trim());
      }
    });
  });
};

const pwd = () => {
  stdout.write('\x1b[0m');
  stdout.write('Password: ');
  stdout.write('\x1b[8m');
  return new Promise((resolve, reject) => {
    stdin.addListener('data', (val) => {
      //give an error when input val not valid
      if (String(val).trim().length < 4 || String(val).trim().length > 16) {
        stdout.write('Password: ');
        stdout.write('\x1b[8m');
      } else {
        stdout.write('\x1b[0m');
        stdin.removeAllListeners('data');
        resolve(String(val).trim());
      }
    });
  });
};

const connect = async (host, code, password) => {
  try {
    await got.put(`http://fsonhostmain-001-site1.ctempurl.com/room?code=${code}&password=${password}`, {
      form: {
        host: host,
      },
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
