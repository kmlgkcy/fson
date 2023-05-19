let adminPassword;

const stdin = process.openStdin();
const stdout = process.stdout;

export const authenticate = (password) => {
  if (password) {
    return adminPassword == password;
  }
};

export const setPassword = async (password) => {
  if (password) {
    adminPassword = password;
    return;
  }
  console.log('\x1b[36m%s\x1b[0m', 'Set Admin Credentinals');
  stdReset();
  let passwordsNotMatch = true;

  while (passwordsNotMatch) {
    const password = await pwd();
    const passwordAgain = await pwd(true);
    if (password === passwordAgain) {
      adminPassword = password;
      passwordsNotMatch = false;
    }
    console.clear();
  }
};
const pwd = (isAgain) => {
  let prompt = 'Password: ';
  if (isAgain) {
    prompt = 'Password Again: ';
  }
  stdout.write(prompt);
  stdInvisible();
  return new Promise((resolve, reject) => {
    stdin.addListener('data', (val) => {
      stdReset();
      if (String(val).trim().length < 4 || String(val).trim().length > 16) {
        stdout.write(prompt);
        stdInvisible();
      } else {
        stdin.removeAllListeners('data');
        resolve(String(val).trim());
      }
    });
  });
};

function stdInvisible() {
  stdout.write('\x1b[8m');
}
function stdReset() {
  stdout.write('\x1b[0m');
}
